'use client';
import React, { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { SessionUser, SelectFaculty, SelectStudent } from '@/drizzle/schema';
import { Mail, MapPin, Clock, Phone, Building, User, Briefcase, Edit2 } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

type FacultyWithEmail = SelectFaculty & { email: string };

type AdminUser = { role: 'admin'; info: SessionUser };
type FacultyUser = { role: 'faculty'; info: FacultyWithEmail };
type StudentUser = { role: 'student'; info: SelectStudent };

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [adminInfo, setAdminInfo] = useState<AdminUser | null>(null);
  const [facultyInfo, setFacultyInfo] = useState<FacultyUser | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    sitting: '',
    freeTimeSlots: '',
    contactNumber: '',
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/getUserBySession');
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setRole(data.role);
      if (data.role === 'admin') {
        setAdminInfo(data as AdminUser);
      } else if (data.role === 'faculty' || data.role === 'coordinator') {
        setFacultyInfo(data as FacultyUser);
        // Initialize form data for faculty
        setFormData({
          ...formData,
          sitting: data.info?.sitting || '',
          freeTimeSlots: Array.isArray(data.info?.freeTimeSlots) ? data.info.freeTimeSlots.join(', ') : '',
        });
      } else {
        setStudentInfo(data as StudentUser);
        // Initialize form data for student
        setFormData({
          ...formData,
          contactNumber: data.info?.contactNumber || '',
        });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let dataToUpdate = {};

      if (role === 'faculty' || role === 'coordinator') {
        // Convert comma-separated string to array
        const freeTimeSlots = formData.freeTimeSlots
          ? formData.freeTimeSlots
              .split(',')
              .map((slot) => slot.trim())
              .filter((slot) => slot !== '')
          : [];

        dataToUpdate = {
          sitting: formData.sitting || '',
          freeTimeSlots,
        };
      } else if (role === 'student') {
        dataToUpdate = {
          contactNumber: formData.contactNumber || '',
        };
      }

      // Construct the payload
      const payload = {
        role: role,
        ...dataToUpdate,
      };

      const res = await fetch('/api/user/updateUserInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update user information');
      }

      // Refresh user data instead of reloading the page
      await fetchUserData();
      closeModal();
    } catch (err) {
      console.error('Error updating user info:', err);
      alert(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 shadow-theme-xs">
        <div className="flex justify-center py-8">
          <div className="text-center p-4 bg-error-50 dark:bg-error-500/10 rounded-lg text-error-600 dark:text-error-400">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any user data
  const hasUserData = adminInfo !== null || facultyInfo !== null || studentInfo !== null;

  if (!hasUserData && !loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 shadow-theme-xs">
        <div className="flex justify-center py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            No user information available
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 shadow-theme-xs relative min-h-[200px]">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Personal Information</h4>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const InfoItem = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
    <div className="bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:shadow-theme-xs">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );

  const TimeSlotBadge = ({ slot }: { slot: string }) => (
    <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/[0.12] dark:text-brand-400">
      <Clock className="mr-1 h-3 w-3" />
      {slot}
    </span>
  );

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 shadow-theme-xs">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Personal Information</h4>

            {/* Hide edit button for admin users */}
            {role !== 'admin' && (
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {role === 'admin' && adminInfo && (
              <>
                <InfoItem label="Email" value={adminInfo.info?.email || 'Not provided'} icon={Mail} />
                <InfoItem label="Role" value="Administrator" icon={Briefcase} />
              </>
            )}

            {(role === 'faculty' || role === 'coordinator') && facultyInfo && (
              <>
                <InfoItem label="Name" value={facultyInfo.info?.name || 'Not provided'} icon={User} />
                <InfoItem label="Email" value={facultyInfo.info?.email || 'Not provided'} icon={Mail} />
                <InfoItem label="Department" value={facultyInfo.info?.department || 'Not specified'} icon={Building} />
                <InfoItem label="Seating" value={facultyInfo.info?.sitting || 'Not specified'} icon={MapPin} />

                <div className="md:col-span-2 bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:shadow-theme-xs">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="w-full">
                      <p className="mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Free Time Slots
                      </p>
                      {Array.isArray(facultyInfo.info?.freeTimeSlots) && facultyInfo.info?.freeTimeSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {facultyInfo.info.freeTimeSlots.map((slot, idx) => (
                            <TimeSlotBadge key={idx} slot={slot} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>

                <InfoItem
                  label="Role"
                  value={role === 'coordinator' ? 'Department Coordinator' : 'Faculty'}
                  icon={Briefcase}
                />
              </>
            )}

            {role === 'student' && studentInfo && (
              <>
                <InfoItem label="Name" value={studentInfo.info?.name || 'Not provided'} icon={User} />
                <InfoItem label="Email" value={studentInfo.info?.email || 'Not provided'} icon={Mail} />
                <InfoItem label="Roll Number" value={studentInfo.info?.rollNumber || 'Not provided'} icon={User} />
                <InfoItem label="Division" value={studentInfo.info?.division || 'Not specified'} icon={Building} />
                <InfoItem
                  label="Group"
                  value={studentInfo.info?.groupNumber?.toString() || 'Not specified'}
                  icon={User}
                />
                <InfoItem label="Contact" value={studentInfo.info?.contactNumber || 'Not provided'} icon={Phone} />
              </>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          {isSaving && <LoadingOverlay />}

          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Personal Information</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {(role === 'faculty' || role === 'coordinator') && facultyInfo && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Faculty Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          Seating
                        </div>
                      </Label>
                      <Input
                        type="text"
                        name="sitting"
                        value={formData.sitting}
                        onChange={handleInputChange}
                        placeholder="e.g., AB-2 301"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Free Time Slots (comma separated)
                        </div>
                      </Label>
                      <Input
                        type="text"
                        name="freeTimeSlots"
                        value={formData.freeTimeSlots}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon 2-4, Wed 10-12"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Enter time slots when you are available for meetings, separated by commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {role === 'student' && studentInfo && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Student Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-2">
                      <Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          Contact Number
                        </div>
                      </Label>
                      <Input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., +91 9876543210"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
