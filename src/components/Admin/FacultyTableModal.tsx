'use client';
import { InferSelectModel } from 'drizzle-orm';
import { useState } from 'react';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import { faculty } from '@/drizzle/schema';
import Label from '@/components/Home/form/Label';
import Input from '../Home/form/input/InputField';
import Image from 'next/image';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    id: string;
    email: string | null;
    role: string;
  };
};

type FacultyTableModalProps = {
  isOpen: boolean;
  setHasEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onCloseCross: () => void;
  selectedFaculty: FacultyWithUser;
};

export default function FacultyTableModal({ selectedFaculty, isOpen, onClose, setHasEdit }: FacultyTableModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: selectedFaculty.user.id,
    name: selectedFaculty.faculty.name || '',
    department: selectedFaculty.faculty.department || '',
    role: selectedFaculty.user.role,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await fetch('/api/admin/updateFaculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setHasEdit((prev) => !prev);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const toggleRole = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === 'faculty' ? 'coordinator' : 'faculty',
    }));
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Faculty Details</h4>
        <br />
        <div className="flex justify-center gap-20 mb-5">
          <div className="w-40 h-40 overflow-hidden rounded-full">
            <Image width={160} height={160} src="/images/user/DefaultProfile_Light.png" alt={formData.name} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Label>Department</Label>
              <Input
                type="text"
                value={formData.department}
                disabled={!isEditing}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <Label>Sitting</Label>
          <Input type="text" value={selectedFaculty.faculty.sitting || ''} disabled />
        </div>

        <div className="mb-3">
          <Label>Free Time Slots</Label>
          <div className="rounded p-1 text-gray-800 dark:text-white/90">
            {Array.isArray(selectedFaculty.faculty.freeTimeSlots)
              ? selectedFaculty.faculty.freeTimeSlots.map((slot, index) => (
                  <div key={index} className="mb-1">
                    {slot}
                  </div>
                ))
              : selectedFaculty.faculty.freeTimeSlots || 'No time slots available'}
          </div>
        </div>

        <div className="mb-4">
          <Label>Role</Label>
          <div className="flex gap-2 items-center">
            <Input type="text" value={formData.role} disabled />
            {isEditing && (
              <Button size="sm" onClick={toggleRole}>
                Toggle
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
