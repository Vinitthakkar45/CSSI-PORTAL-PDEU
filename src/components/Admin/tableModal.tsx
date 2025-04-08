'use client';
import React from 'react';
import { InferSelectModel } from 'drizzle-orm';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import { student as studentSchema } from '@/drizzle/schema';
import Image from 'next/image';
import Label from '@/components/Home/form/Label';
import Input from '../Home/form/input/InputField';

type TableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
  selectedStudent: InferSelectModel<typeof studentSchema>;
};

export default function TableModal({ selectedStudent, isOpen, onClose, onCloseCross }: TableModalProps) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <form className="overflow-y-auto max-h-[80vh] no-scrollbar">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Student Details</h4>
          <br />
          {/* Student Image and Basic Details */}
          <div className="flex justify-center gap-20 mb-5">
            <div className="w-40 h-40 overflow-hidden rounded-full">
              <Image
                width={160}
                height={160}
                src={selectedStudent.profileImage ? selectedStudent.profileImage : ''}
                alt={selectedStudent.name ? selectedStudent.name : ''}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <Label>Name</Label>
                <Input type="text" value={selectedStudent.name || ''} disabled />
              </div>
              <div className="mb-4">
                <Label>Roll Number</Label>
                <Input type="text" value={selectedStudent.rollNumber || ''} disabled />
              </div>
            </div>
          </div>

          {/* Student Dept */}
          <div className="mb-3">
            <Label>Department</Label>
            <Input type="text" value={selectedStudent.department || ''} disabled />
          </div>

          {/* Student Email */}

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label>Division</Label>
              <Input type="text" value={selectedStudent.division || 'N/A'} disabled />
            </div>
            <div>
              <Label>Group</Label>
              <Input type="text" value={selectedStudent.groupNumber || 'N/A'} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="mb-4">
              <Label>Email</Label>
              <Input type="text" value={selectedStudent.email || ''} disabled />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input type="text" value={selectedStudent.contactNumber || 'N/A'} disabled />
            </div>
          </div>

          <br />
          {/* NGO Details */}
          <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">NGO Details</h5>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label>NGO Name</Label>
              <Input type="text" value={selectedStudent.ngoName || 'N/A'} disabled />
            </div>
            <div>
              <Label>City</Label>
              <Input type="text" value={selectedStudent.ngoCity || 'N/A'} disabled />
            </div>
          </div>
          <div className="mb-4">
            <Label>Field of Work</Label>
            <Input type="text" value={selectedStudent.ngoNatureOfWork || 'N/A'} disabled />
          </div>
          <div className="mb-4">
            <Label>Address</Label>
            <Input type="text" value={selectedStudent.ngoName || 'N/A'} disabled />
          </div>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div>
              <Label>District</Label>
              <Input type="text" value={selectedStudent.ngoDistrict || 'N/A'} disabled />
            </div>
            <div>
              <Label>State</Label>
              <Input type="text" value={selectedStudent.ngoDistrict || 'N/A'} disabled />
            </div>
            <div>
              <Label>Country</Label>
              <Input type="text" value={selectedStudent.ngoCountry || 'N/A'} disabled />
            </div>
          </div>

          <div className="mb-6">
            <Label>NGO Phone Number</Label>
            <Input type="text" value={selectedStudent.ngoPhone || 'N/A'} disabled />
          </div>

          <br />

          <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Project Details</h5>

          <div className="mb-4">
            <Label>Problem Statement</Label>
            <Input type="text" value={selectedStudent.problemDefinition || 'N/A'} disabled />
          </div>
          <div className="mb-6">
            <Label>Approach of Solving Problem</Label>
            <Input type="text" value={selectedStudent.proposedSolution || 'N/A'} disabled />
          </div>

          <br />

          <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Documents and Proof of Work</h5>

          <div className="mb-4">
            <Label>Report</Label>

            <p>{selectedStudent.report} </p>
          </div>

          <div className="mb-4">
            <Label>Certificate</Label>

            <p>{selectedStudent.certificate} </p>
          </div>

          <div className="mb-4">
            <Label>Poster</Label>
            <p>{selectedStudent.poster} </p>
          </div>

          <div className="mb-4">
            <Label>Offer Letter</Label>
            <p>{selectedStudent.offerLetter} </p>
          </div>

          <br />
          <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Evaluation</h5>
          <div className="mb-6">
            <Label>{'Internal Marks'}</Label>
            <Input
              type="number"
              value={selectedStudent.internal_evaluation_marks || ''} // Use empty string as fallback for null or undefined
              disabled
            />
          </div>

          <div className="mb-6">
            <Label>{'Final Marks'}</Label>
            <Input
              type="number"
              value={selectedStudent.final_evaluation_marks || ''} // Use empty string as fallback for null or undefined
              disabled
            />
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
