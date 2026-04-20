'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from '@/components/Home/ui/toast/Toast';

type UserInfo = {
  name?: string;
  email?: string;
  profileImage?: string;
  department?: string;
};

type UserData = {
  role: string;
  info: UserInfo;
};

const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '';
const BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? '';

export function buildProfileUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${MEDIA_BASE}/${BUCKET}/${key}`;
}

export default function UserMetaCard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  // Local preview URL — blob URL immediately after file pick, real URL after upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/getUserBySession', { cache: 'no-store' });
      if (!res.ok) throw new Error("Can't fetch user data");
      setUserData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local blob preview instantly — no waiting for upload
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch('/api/user/upload-profile-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Revert preview on failure
        setPreviewUrl(null);
        throw new Error(err.error ?? 'Upload failed');
      }
      const { key } = await res.json();

      // Switch from blob URL to the real MinIO URL (timestamp in key → always fresh)
      const realUrl = buildProfileUrl(key)!;
      setPreviewUrl(realUrl);
      URL.revokeObjectURL(blobUrl);

      // Notify header (UserDropdown) without a shared context
      window.dispatchEvent(new CustomEvent('profile-image-updated', { detail: { url: realUrl } }));

      // Refresh full user data in background (updates name/role etc.)
      await fetchUserData();
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Prefer the local preview (set after upload), fall back to DB value
  const imgSrc = previewUrl ?? buildProfileUrl(userData?.info?.profileImage);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">

          {/* Avatar with upload overlay */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              {imgSrc ? (
                <img src={imgSrc} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <img
                  src="/images/user/DefaultProfile_Light.png"
                  alt="Default Profile"
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
              className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-500 text-white shadow hover:bg-brand-600 disabled:opacity-50 transition-colors"
              title="Change profile photo"
            >
              {uploading ? (
                <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-3 h-3" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {loading ? (
                <span className="inline-block h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                userData?.info?.name || 'User'
              )}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.role || 'Member'}</p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userData?.info?.department || 'Department'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
