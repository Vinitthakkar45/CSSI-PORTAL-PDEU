'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../Home/ui/badge/Badge';
import { student } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import LoadingOverlay from '../LoadingOverlay';
import TableModal from './tableModal';
import Button from '../Home/ui/button/Button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const [filteredStudents, setFilteredStudents] = useState<StudentWithUser[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/students');
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

    if (selectedDepartment !== 'ALL') {
      result = result.filter((student) => student.student.department === selectedDepartment);
    }

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

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDepartment]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredStudents]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCSVDownload = () => {
    try {
      const flattenedData = filteredStudents.map((item) => {
        return {
          'Roll Number': item.student.rollNumber,
          Name: item.student.name,
          Department: item.student.department,
          Division: item.student.division,
          'Group Number': item.student.groupNumber,
          'Contact Number': item.student.contactNumber,
          Email: item.student.email || item.user.email,
          'NGO Name': item.student.ngoName,
          'NGO City': item.student.ngoCity,
          'NGO District': item.student.ngoDistrict,
          'NGO State': item.student.ngoState,
          'NGO Country': item.student.ngoCountry,
          'NGO Address': item.student.ngoAddress,
          'Nature of Work (NGO)': item.student.ngoNatureOfWork,
          'NGO Email': item.student.ngoEmail,
          'NGO Phone': item.student.ngoPhone,
          'Problem Definition': item.student.problemDefinition,
          'Proposed Solution': item.student.proposedSolution,
          'Internal Evaluation Marks': item.student.internal_evaluation_marks,
          'Final Evaluation Marks': item.student.final_evaluation_marks,
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      const columnCount = Object.keys(flattenedData[0]).length;
      worksheet['!cols'] = new Array(columnCount).fill({ wch: 25 });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'student-data.xlsx');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading student data...</div>;
  }

  return (
    <>
      {showModal && selectedStudent && (
        <TableModal
          selectedStudent={selectedStudent.student}
          isOpen={showModal}
          onClose={handleModalclose}
          onCloseCross={handleModalclose}
        />
      )}

      {loading && <LoadingOverlay />}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Student Details</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto mb-2 sm:mb-0">
              <input
                type="text"
                placeholder="Search by roll number or email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="ALL">All</option>
                <option value="CSE">CSE</option>
                <option value="MATHS">MATHS</option>
                <option value="ECE">ECE</option>
                <option value="ICT">ICT</option>
              </select>
            </div>
            <Button size="sm" variant="primary" className="mr-4" onClick={handleCSVDownload}>
              Download CSV
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full table-fixed">
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 px-4 w-16 md:w-20 text-gray-500 text-start dark:text-gray-400">
                  ID
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-40 md:w-48 text-gray-500 text-start dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  Department
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  NGO Name
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  NGO Contact
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  NGO Location
                </TableCell>
                <TableCell isHeader className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item) => (
                  <TableRow
                    key={item.student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => handleCellClick(item)}
                  >
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.student.id}</TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">{item.student.name}</p>
                          <span className="text-gray-500 dark:text-gray-400">{item.student.rollNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.user.email}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {item.student.department}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.student.ngoName}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {item.student.ngoPhone}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.student.ngoCity}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-500 dark:text-gray-400">
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
