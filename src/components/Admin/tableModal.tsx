'use client';
import React from 'react';
import { InferSelectModel } from 'drizzle-orm';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import { student as studentSchema } from '@/drizzle/schema';

type TableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
  student: InferSelectModel<typeof studentSchema>;
};

export default function TableModal({ student, isOpen, onClose, onCloseCross }: TableModalProps) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <div className="overflow-y-auto max-h-[80vh] no-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(student).map(([key, value]) => (
              <div key={key} className="bg-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-sm font-medium text-gray-500">{key}</p>
                <p className="text-base font-semibold text-gray-800">
                  {value === null || value === undefined ? '—' : value.toString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={onCloseCross}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
