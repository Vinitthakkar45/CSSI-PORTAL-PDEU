'use client';
import { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../Home/ui/badge/Badge';
import { faculty, SelectStudent } from '@/drizzle/schema';
import { useSession } from 'next-auth/react';
import Button from '../Home/ui/button/Button';
import AddStudentModal from './AddStudentModal';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/components/Home/ui/toast/Toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import StudentModal from './Modal/StudentModal';
import StudentTableSkeleton from './Skeletons/StudentTableSkele';
import { InferSelectModel } from 'drizzle-orm';

type StudentWithUser = {
  student: SelectStudent;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
  mentor: InferSelectModel<typeof faculty>;
  evaluator: InferSelectModel<typeof faculty>;
};

// Helper function to get cache key for a specific coordinator
const getCacheKey = (id: string) => `coord_students_cache_${id}`;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to get cached data
const getCachedStudents = (id: string): { data: StudentWithUser[]; timestamp: number } | null => {
  try {
    const CACHE_KEY = getCacheKey(id);
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const parsed = JSON.parse(cachedData);
    return parsed;
  } catch (error) {
    console.error('Error parsing cached student data:', error);
    return null;
  }
};

// Helper function to set cached data
const setCachedStudents = (id: string, data: StudentWithUser[]) => {
  try {
    const CACHE_KEY = getCacheKey(id);
    const now = Date.now();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: now,
      })
    );
    return now;
  } catch (error) {
    console.error('Error caching student data:', error);
    return Date.now();
  }
};

const StudentTable = () => {
  const session = useSession();
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const [marksToggle, setMarksToggle] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // Initialize from cache immediately
  useEffect(() => {
    const userId = session.data?.user?.id;
    if (userId) {
      const cached = getCachedStudents(userId);
      if (cached) {
        setStudents(cached.data);
        setFilteredStudents(cached.data);
        setLastFetched(cached.timestamp);
        setLoading(false);
      }
    }
  }, [session.data?.user?.id]);

  const fetchStudents = useCallback(
    async (forceRefresh = false) => {
      const userId = session.data?.user?.id;
      if (!userId) return;

      try {
        setLoading(true);

        // Check if we have cached data
        const cached = getCachedStudents(userId);
        const now = Date.now();

        // Use cache if available and not forced refresh and not expired
        if (!forceRefresh && cached && now - cached.timestamp < CACHE_EXPIRY) {
          setStudents(cached.data);
          setFilteredStudents(cached.data);
          setLastFetched(cached.timestamp);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const res = await fetch('/api/coord/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });

        const data = await res.json();

        // Update state with new data
        setStudents(data);
        setFilteredStudents(data);

        // Cache the new data
        const timestamp = setCachedStudents(userId, data);
        setLastFetched(timestamp);
      } catch (error) {
        console.error('Error fetching student data:', error);

        // Fallback to cache on error
        if (userId) {
          const cached = getCachedStudents(userId);
          if (cached) {
            setStudents(cached.data);
            setFilteredStudents(cached.data);
            toast.error('Failed to fetch fresh data. Using cached data.');
          } else {
            toast.error('Failed to load student data.');
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [session.data?.user?.id]
  );

  useEffect(() => {
    const userId = session.data?.user?.id;
    if (!userId) return;

    // Only fetch if we don't have data from cache
    if (students.length === 0) {
      fetchStudents();
    } else {
      // If we have data but it might be stale, refresh in background
      const cached = getCachedStudents(userId);
      const now = Date.now();
      if (cached && now - cached.timestamp > CACHE_EXPIRY) {
        fetchStudents();
      }
    }
  }, [fetchStudents, students.length, session.data?.user?.id]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = students.filter(({ student, user }) => {
        return (
          student.rollNumber?.toLowerCase().includes(lowerSearch) ||
          (user.email?.toLowerCase() || '').includes(lowerSearch)
        );
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Add a refresh function that can be called manually
  const refreshData = () => {
    fetchStudents(true);
  };

  const handleModalclose = () => {
    setShowModal(false);
  };

  const handleCellClick = (item: StudentWithUser) => {
    setSelectedStudent(item);
    setShowModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddStudent = () => {
    setShowAdd(true);
  };

  const handleAddStudentClose = () => {
    setShowAdd(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredStudents]);

  if (loading && students.length === 0) {
    return <StudentTableSkeleton />;
  }

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
          'Mentor Name': item.mentor?.name || 'N/A',
          'Evaluator Name': item.evaluator?.name || 'N/A',
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

  return (
    <>
      {showAdd && <AddStudentModal isOpen={showAdd} onClose={handleAddStudentClose} />}
      {showModal && selectedStudent && (
        <StudentModal
          isOpen={showModal}
          onClose={handleModalclose}
          selectedStudent={selectedStudent}
          option="both"
          setMarksToggle={setMarksToggle}
          marksToggle={marksToggle}
          students={students}
          setStudents={setStudents}
        />
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Student Details</h3>
            <button
              onClick={refreshData}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {lastFetched > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(lastFetched).toLocaleTimeString()}
              </span>
            )}
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
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button size="sm" variant="primary" className="mr-4" onClick={handleCSVDownload}>
              <span className="hidden sm:inline">Download CSV</span>
              <span className="inline sm:hidden">
                <Download className="w-4 h-4" />
              </span>
            </Button>
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
                {/* <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  NGO Contact
                </TableCell> */}
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
                  NGO Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <TableRow
                    key={item.student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => handleCellClick(item)}
                  >
                    <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {(currentPage - 1) * itemsPerPage + index + 1}
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
                      {(item.student.ngoName && item.student.ngoName?.substring(0, 10) + '...') || 'N/A'}
                    </TableCell>
                    {/* <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 truncate">
                      {item.student.ngoPhone}
                    </TableCell> */}
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
