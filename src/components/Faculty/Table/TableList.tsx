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
          <div className=" sm:min-w-full sm:w-auto w-[600px]">
            <Table className="table-auto sm:table-fixed">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-start text-theme-sm sm:text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Student
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Roll Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    NGO Selection
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 font-medium dark:text-gray-400"
                  >
                    NGO
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {students.map((student) => (
                  <TableRow key={student.id} onClick={() => handleOpenModal(student)} className="hover:cursor-pointer">
                    <TableCell className="px-2 sm:px-3 md:px-5 py-2 sm:py-3 text-start text-theme-sm sm:text-theme-xs">
                      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={student.profileImage || '/images/user/user-17.jpg'}
                            alt={student.name || ''}
                          />
                        </div>
                        <span className="block font-medium text-gray-800 text-theme-sm sm:text-theme-xs dark:text-white/90">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 dark:text-gray-400">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-theme-sm sm:text-theme-xs text-gray-500 dark:text-gray-400">
                      {student.department}
                    </TableCell>
                    <TableCell className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-start text-theme-sm sm:text-theme-xs text-gray-500 dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          student.ngoChosen === true ? 'success' : student.ngoChosen === false ? 'warning' : 'error'
                        }
                      >
                        {student.ngoChosen === true ? 'Completed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-theme-sm sm:text-theme-xs text-gray-500 dark:text-gray-400">
                      {student.ngoName ? student.ngoName : 'N/A'}
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
