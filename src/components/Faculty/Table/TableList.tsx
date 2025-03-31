import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../../Home/ui/badge/Badge';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/Home/ui/button/Button';
import { Modal } from '@/components/Home/ui/modal';
import Label from '@/components/Home/form/Label';
import Input from '@/components/Home/form/input/InputField';

interface Student {
  id: number;
  rollNumber: string;
  department: string;
  ngoName: string;
  ngoLocation: string;
  ngoPhone: string;
  ngoDescription: string;
  name: string;
  email: string;
  ngoStatus: string;
  image: string;
  mentorMarks: number;
  evaluatorMarks: number;
}

export default function TableList({
  students,
  option, // Prop to determine if the list is for mentoring or evaluating
}: {
  students: Student[];
  option: 'mentor' | 'evaluator';
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // State to store the selected student
  const [marks, setMarks] = useState<number | 0>(0); // State to store marks

  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student); // Set the selected student
    setMarks(0); // Reset marks field
    openModal(); // Open the modal
  };

  const handleSave = async (type: string) => {
    if (!selectedStudent || marks === 0) {
      alert('Please enter marks before saving.');
      return;
    }

    const typeofmarks = type === 'mentor' ? 'internal' : 'final';
    const studentid = selectedStudent.id;
    console.log('Saving marks:', { studentid, typeofmarks, marks });
    try {
      const response = await fetch('/api/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, typeofmarks, marks }),
      });

      console.log('Response:', response);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      alert('Marks saved successfully!');
      // closeModal(); // Close modal on successful submission
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || 'Failed to save marks');
      } else {
        alert('Failed to save marks');
      }
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Student
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Roll Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    NGO Selected
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    NGO
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {students.map((student) => (
                  <TableRow key={student.id} onClick={() => handleOpenModal(student)}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image width={40} height={40} src={student.image} alt={student.name} />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {student.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.department}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          student.ngoStatus === 'active'
                            ? 'success'
                            : student.ngoStatus === 'pending'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {student.ngoStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.ngoName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-5 lg:p-10">
        {selectedStudent && (
          <form className="overflow-y-auto max-h-[80vh] no-scrollbar">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Student Details</h4>
            <br />
            {/* Student Image and Basic Details */}
            <div className="flex justify-center gap-20 mb-5">
              <div className="w-40 h-40 overflow-hidden rounded-full">
                <Image width={160} height={160} src={selectedStudent.image} alt={selectedStudent.name} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <Label>Name</Label>
                  <Input type="text" defaultValue={selectedStudent.name} disabled />
                </div>
                <div className="mb-4">
                  <Label>Roll Number</Label>
                  <Input type="text" defaultValue={selectedStudent.rollNumber} disabled />
                </div>
              </div>
            </div>

            {/* Student Dept */}
            <div className="mb-3">
              <Label>Department</Label>
              <Input type="text" defaultValue={selectedStudent.department} disabled />
            </div>

            {/* Student Email */}
            <div className="mb-4">
              <Label>Email</Label>
              <Input type="text" defaultValue={selectedStudent.email} disabled />
            </div>
            <br />
            {/* NGO Details */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">NGO Details</h5>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <Label>NGO Name</Label>
                <Input type="text" defaultValue={selectedStudent.ngoName || 'N/A'} disabled />
              </div>
              <div>
                <Label>NGO Location</Label>
                <Input type="text" defaultValue={selectedStudent.ngoLocation || 'N/A'} disabled />
              </div>
            </div>
            <div className="mb-4">
              <Label>NGO Description</Label>
              <Input type="text" defaultValue={selectedStudent.ngoDescription || 'N/A'} disabled />
            </div>
            <div className="mb-6">
              <Label>NGO Phone Number</Label>
              <Input type="text" defaultValue={selectedStudent.ngoPhone || 'N/A'} disabled />
            </div>

            <br />
            {/* Evaluation Section */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Evaluation</h5>
            <div className="mb-6">
              <Label>{'Internal Marks'}</Label>
              <Input
                type="number"
                defaultValue={selectedStudent.mentorMarks ? selectedStudent.mentorMarks : ''}
                onChange={(e) => setMarks(Number(e.target.value) || 0)}
                placeholder={`${option === 'mentor' ? 'Enter the internal marks' : 'To be entered by the Mentor'}`}
                disabled={option === 'mentor' ? false : true} // Disable if not active for mentor
              />
            </div>

            <div className="mb-6">
              <Label>{'Final Marks'}</Label>
              <Input
                type="number"
                defaultValue={selectedStudent.evaluatorMarks ? selectedStudent.evaluatorMarks : ''}
                onChange={(e) => setMarks(Number(e.target.value) || 0)}
                placeholder={`${option === 'mentor' ? 'To be entered by Evaluator' : 'Enter the final marks'}`}
                disabled={option === 'mentor' ? true : false}
              />
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  await handleSave(option);
                }}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
