'use client';
import React from 'react';
import Button from '@/components/Home/ui/button/Button';
import { Modal } from '@/components/Home/ui/modal';
import Label from '@/components/Home/form/Label';
import Input from '@/components/Home/form/input/InputField';

export default function FormInModal({
  isOpen,
  closeModal,
  handleSave,
}: {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
      <form className="">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Personal Information</h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>First Name</Label>
            <Input type="text" placeholder="Emirhan" />
          </div>

          <div className="col-span-1">
            <Label>Last Name</Label>
            <Input type="text" placeholder="Boruch" />
          </div>

          <div className="col-span-1">
            <Label>Last Name</Label>
            <Input type="email" placeholder="emirhanboruch55@gmail.com" />
          </div>

          <div className="col-span-1">
            <Label>Phone</Label>
            <Input type="text" placeholder="+09 363 398 46" />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label>Bio</Label>
            <Input type="text" placeholder="Team Manager" />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
