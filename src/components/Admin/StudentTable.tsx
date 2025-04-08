'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../Home/ui/badge/Badge';
import { student } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import TableModal from './tableModal';

type StudentWithUser = {
  student: InferSelectModel<typeof student>;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

const StudentTable = () => {
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/students');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const handleModalclose = () => {
    setShowModal(false);
  };

  const handleCellClick = (item: StudentWithUser) => {
    setSelectedStudent(item);
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading student data...</div>;
  }

  return (
    <>
      {showModal && selectedStudent && (
        <TableModal
          student={selectedStudent.student}
          isOpen={showModal}
          onClose={handleModalclose}
          onCloseCross={handleModalclose}
        ></TableModal>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Student Details</h3>
          </div>
          {/* <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          See all
          </button>
          </div> */}
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-base dark:text-gray-400">
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Roll Number
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-base dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Department
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Contact
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Location
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {students.map((item) => (
                <TableRow
                  key={item.student.id}
                  className=""
                  onClick={() => {
                    handleCellClick(item);
                  }}
                >
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.student.id}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.user.name}</p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {item.student.rollNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.user.email}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.student.department}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.student.ngoName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.student.ngoPhone}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.student.ngoCity}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        item.student.ngoChosen === true
                          ? 'success'
                          : item.student.ngoChosen === false
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {item.student.ngoChosen === true
                        ? 'Chosen'
                        : item.student.ngoChosen === false
                          ? 'Pending'
                          : 'Rejected'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default StudentTable;
