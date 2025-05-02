'use client';
import React, { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { SessionUser, SelectFaculty, SelectStudent } from '@/drizzle/schema';

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

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/getUserBySession');
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setRole(data.role);
        if (data.role === 'admin') {
          setAdminInfo(data as AdminUser);
        } else if (data.role === 'faculty' || data.role === 'coordinator') {
          setFacultyInfo(data as FacultyUser);
        } else {
          setStudentInfo(data as StudentUser);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving changes...');
    closeModal();
  };

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-center py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">Loading user information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-center py-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Check if we have any user data
  const hasUserData = adminInfo !== null || facultyInfo !== null || studentInfo !== null;

  if (!hasUserData) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-center py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">No user information available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Personal Information</h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            {role === 'admin' && adminInfo && (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {adminInfo.info?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Admin</p>
                </div>
              </>
            )}

            {(role === 'faculty' || role === 'coordinator') && facultyInfo && (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {facultyInfo.info?.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {facultyInfo.info?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {facultyInfo.info?.department || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Seating</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {facultyInfo.info?.sitting || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Free Time Slots</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {Array.isArray(facultyInfo.info?.freeTimeSlots) && facultyInfo.info?.freeTimeSlots.length > 0
                      ? facultyInfo.info.freeTimeSlots.join(', ')
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Faculty</p>
                </div>
              </>
            )}

            {role === 'student' && studentInfo && (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Roll Number</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.rollNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Division</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.division || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Group</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.groupNumber || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {studentInfo.info?.contactNumber || 'Not provided'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Personal Information</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {role === 'admin' && adminInfo && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Admin Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Email</Label>
                      <Input type="email" defaultValue={adminInfo.info?.email || ''} />
                    </div>
                  </div>
                </div>
              )}

              {role === 'faculty' && facultyInfo && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Faculty Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Name</Label>
                      <Input type="text" defaultValue={facultyInfo.info?.name || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Email</Label>
                      <Input type="email" defaultValue={facultyInfo.info?.email || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Department</Label>
                      <Input type="text" defaultValue={facultyInfo.info?.department || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Seating</Label>
                      <Input type="text" defaultValue={facultyInfo.info?.sitting || ''} />
                    </div>
                    <div className="col-span-2">
                      <Label>Free Time Slots (comma separated)</Label>
                      <Input
                        type="text"
                        defaultValue={
                          Array.isArray(facultyInfo.info?.freeTimeSlots)
                            ? facultyInfo.info.freeTimeSlots.join(', ')
                            : ''
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === 'student' && studentInfo && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Student Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Name</Label>
                      <Input type="text" defaultValue={studentInfo.info?.name || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Email</Label>
                      <Input type="email" defaultValue={studentInfo.info?.email || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Roll Number</Label>
                      <Input type="text" defaultValue={studentInfo.info?.rollNumber || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Department</Label>
                      <Input type="text" defaultValue={studentInfo.info?.department || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Division</Label>
                      <Input type="text" defaultValue={studentInfo.info?.division || ''} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Group</Label>
                      <Input type="text" defaultValue={studentInfo.info?.groupNumber || ''} />
                    </div>
                    <div className="col-span-2">
                      <Label>Contact Number</Label>
                      <Input type="text" defaultValue={studentInfo.info?.contactNumber || ''} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
