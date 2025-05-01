'use client';
import { InferSelectModel } from 'drizzle-orm';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import { faculty } from '@/drizzle/schema';
import Label from '@/components/Home/form/Label';
import Input from '../Home/form/input/InputField';

type FacultyTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
  selectedFaculty: InferSelectModel<typeof faculty>;
};

export default function FacultyTableModal({ selectedFaculty, isOpen, onClose, onCloseCross }: FacultyTableModalProps) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Faculty Details</h4>
        <br />
        <div className="w-40 h-40 overflow-hidden rounded-full">
          {/* <Image
                width={160}
                height={160}
                src={selectedFaculty.profileImage ? selectedFaculty.profileImage : ''}
                alt={selectedFaculty.name ? selectedFaculty.name : ''}
              /> */}
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <Label>Name</Label>
            <Input type="text" value={selectedFaculty.name || ''} disabled />
          </div>
        </div>

        <div className="mb-3">
          <Label>Department</Label>
          <Input type="text" value={selectedFaculty.department || ''} disabled />
        </div>

        <div className="mb-3">
          <Label>Sittting</Label>
          <Input type="text" value={selectedFaculty.sitting || ''} disabled />
        </div>
        <div className="mb-3">
          <Label>Free Time Slots</Label>
          <div className="p-2  rounded  text-gray-800 dark:text-white/90">
            {Array.isArray(selectedFaculty.freeTimeSlots)
              ? selectedFaculty.freeTimeSlots.map((slot, index) => (
                  <div key={index} className="mb-1">
                    {slot}
                  </div>
                ))
              : selectedFaculty.freeTimeSlots || 'No time slots available'}
          </div>
        </div>
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
