// --- TableList.tsx ---
import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../../Home/ui/badge/Badge';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import StudentModal from '../Modal/StudentModal';
import { SelectStudent } from '@/drizzle/schema';

export default function TableList({
  students,
  option,
  setMarksToggle,
  marksToggle,
  setStudents,
}: {
  students: SelectStudent[];
  option: 'mentor' | 'evaluator';
  setMarksToggle: React.Dispatch<React.SetStateAction<boolean>>;
  marksToggle: boolean;
  setStudents: React.Dispatch<React.SetStateAction<SelectStudent[]>>;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStudent, setSelectedStudent] = React.useState<SelectStudent>();

  const handleOpenModal = (student: SelectStudent) => {
    setSelectedStudent(student);
    openModal();
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Student
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Roll Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    NGO Selection
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    NGO
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {students.map((student) => (
                  <TableRow key={student.id} onClick={() => handleOpenModal(student)} className="hover:cursor-pointer">
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={student.profileImage || '/images/user/user-17.jpg'}
                            alt={student.name || ''}
                          />
                        </div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.department}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          student.ngoChosen === true ? 'success' : student.ngoChosen === false ? 'warning' : 'error'
                        }
                      >
                        {student.ngoChosen === true ? 'Completed' : 'Pending'}
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
      <StudentModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedStudent={selectedStudent}
        option={option}
        setMarksToggle={setMarksToggle}
        marksToggle={marksToggle}
        students={students}
        setStudents={setStudents}
      />
    </>
  );
}
