'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../Home/ui/badge/Badge';
import { SelectStudent } from '@/drizzle/schema';
import TableModal from '@/components/Coordinator/StudentTableModal';
import { useSession } from 'next-auth/react';
import Button from '../Home/ui/button/Button';
import AddStudentModal from './AddStudentModal';

type StudentWithUser = {
  student: SelectStudent;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

const StudentTable = () => {
  const session = useSession();
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithUser[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  // Pagination state

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const id = session.data?.user.id;
        console.log(id);
        const res = await fetch('/api/coord/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        setStudents(data);
        setFilteredStudents(data); // initialize with all
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

  const handleFilter = () => {
    let result = students;

    // Apply department filter
    if (selectedDepartment !== 'ALL') {
      result = result.filter((student) => student.student.department === selectedDepartment);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (student) =>
          (student.student.rollNumber && student.student.rollNumber.toLowerCase().includes(term)) ||
          (student.user.email && student.user.email.toLowerCase().includes(term)) ||
          (student.student.name && student.student.name.toLowerCase().includes(term))
      );
    }

    setFilteredStudents(result);
  };

  // Run filter when either search or department changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDepartment]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredStudents]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleAddStudent = () => {
    setShowAdd(true);
  };
  const handleAddStudentClose = () => {
    setShowAdd(false);
  };
  if (loading) {
    return <div className="p-4 text-center">Loading student data...</div>;
  }

  return (
    <>
      {showAdd && <AddStudentModal isOpen={showAdd} onClose={handleAddStudentClose} />}
      {showModal && selectedStudent && (
        <TableModal
          selectedStudent={selectedStudent.student}
          isOpen={showModal}
          onClose={handleModalclose}
          onCloseCross={handleModalclose}
        />
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Student Details</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div>
              <Button size="sm" variant="primary" className="mr-4" onClick={handleAddStudent}>
                Add Student
              </Button>
            </div>
            <div className="w-full sm:w-auto mb-2 sm:mb-0">
              <input
                type="text"
                placeholder="Search by roll number or email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full table-fixed">
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-16 md:w-20 text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-40 md:w-48 text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Department
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Contact
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Location
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((item, index) => (
                  <TableRow
                    key={item.student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => handleCellClick(item)}
                  >
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                            {item.student.name}
                          </p>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400 truncate">
                            {item.student.rollNumber}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.user.email}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.student.department}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.student.ngoName}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.student.ngoPhone}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.student.ngoCity}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                    No students found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination Controls */}

        <div className="flex justify-between items-center mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StudentTable;
