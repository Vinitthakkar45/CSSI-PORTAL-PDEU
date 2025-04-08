'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import Button from '@/components/Home/ui/button/Button';
import { useSession } from 'next-auth/react';
import { SelectStudent } from '@/drizzle/schema';
// import { toast } from 'sonner';

type UserDetails = {
  id: number;
  email: string;
  role: string;
  profileData: SelectStudent | null;
};

export default function NGODetailsForm({
  onComplete,
  userData,
}: {
  onComplete: () => void;
  userData: UserDetails | null;
}) {
  const [formData, setFormData] = useState({
    ngoName: '',
    ngoCity: '',
    ngoDistrict: '',
    ngoState: '',
    ngoCountry: '',
    ngoAddress: '',
    ngoNatureOfWork: '',
    ngoEmail: '',
    ngoPhone: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId || !userData) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const localStorageKey = `ngoDetails_${userId}`;
      const storedData = localStorage.getItem(localStorageKey);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } else if (userData.profileData) {
        // Only use profile data if no localStorage data exists
        const profile = userData.profileData;
        const newFormData = {
          ngoName: profile.ngoName || '',
          ngoCity: profile.ngoCity || '',
          ngoDistrict: profile.ngoDistrict || '',
          ngoState: profile.ngoState || '',
          ngoCountry: profile.ngoCountry || '',
          ngoAddress: profile.ngoAddress || '',
          ngoNatureOfWork: profile.ngoNatureOfWork || '',
          ngoEmail: profile.ngoEmail || '',
          ngoPhone: profile.ngoPhone || '',
        };

        setFormData(newFormData);
        localStorage.setItem(localStorageKey, JSON.stringify(newFormData));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Update localStorage as user types
      if (userId) {
        localStorage.setItem(`ngoDetails_${userId}`, JSON.stringify(newData));
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const ngoData = {
      ngoName: formData.ngoName,
      ngoCity: formData.ngoCity,
      ngoDistrict: formData.ngoDistrict,
      ngoState: formData.ngoState,
      ngoCountry: formData.ngoCountry,
      ngoAddress: formData.ngoAddress,
      ngoNatureOfWork: formData.ngoNatureOfWork,
      ngoEmail: formData.ngoEmail,
      ngoPhone: formData.ngoPhone,
    };

    try {
      const response = await fetch('/api/student/update-ngo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ngoData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status: ${response.status}`);
      }

      await response.json();
      // toast.success("NGO details saved successfully");

      onComplete();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // toast.error("Failed to save NGO details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title="NGO Details">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-pulse">Loading form data...</div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="w-full">
              <Input
                type="text"
                name="ngoName"
                value={formData.ngoName}
                onChange={handleChange}
                placeholder="Enter NGO name"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="ngoCity"
                value={formData.ngoCity}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="ngoDistrict"
                value={formData.ngoDistrict}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="ngoState"
                value={formData.ngoState}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="ngoCountry"
                value={formData.ngoCountry}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="ngoNatureOfWork"
                value={formData.ngoNatureOfWork}
                onChange={handleChange}
                placeholder="Describe nature of work"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="email"
                name="ngoEmail"
                value={formData.ngoEmail}
                onChange={handleChange}
                placeholder="Enter NGO email"
                required
              />
            </div>
            <div className="w-full">
              <Input
                type="tel"
                name="ngoPhone"
                value={formData.ngoPhone}
                onChange={handleChange}
                placeholder="Enter NGO phone"
                required
              />
            </div>
            <div className="w-full md:col-span-2">
              <Input
                type="text"
                name="ngoAddress"
                value={formData.ngoAddress}
                onChange={handleChange}
                placeholder="Enter complete address"
                required
              />
            </div>

            {error && <div className="col-span-1 md:col-span-2 text-red-500 text-sm">{error}</div>}

            <div className="col-span-1 md:col-span-2">
              <Button className="w-full" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </ComponentCard>
  );
}
