'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../Home/ui/badge/Badge';
import { faculty } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import FacultyTableModal from './FacultyTableModal';
import Button from '../Home/ui/button/Button';
import AddFacultyModal from './AddFacultyModal';
import { Modal } from '@/components/Home/ui/modal';
import { useModal } from '@/hooks/useModal';
import UploadExcel from '@/components/UploadExcel';
import { toast } from '@/components/Home/ui/toast/Toast';
import FacultyTableSkeleton from './skeletons/FacultyTableSkele';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    id: string;
    email: string | null;
    role: string;
  };
};

type AssignmentItem = {
  facultyId: number;
  assignedMentor: number;
  evaluatorAssigned: number;
};

export default function FacultyTable() {
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<FacultyWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const { isOpen: isUploadModalOpen, openModal: openUploadModal, closeModal: closeUploadModal } = useModal();
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [hasMentors, setHasMentors] = useState(false);
  const [hasEvaluators, setHasEvaluators] = useState(false);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);
  const [hasEdited, setHasEdited] = useState<boolean>(false);

  const handleUploadSuccess = async () => {
    // Refresh the faculty list
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faculty');

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to refresh faculty list');
      }

      const data = await res.json();
      setFaculties(data);
      setFilteredFaculties(data);
      closeUploadModal();
      toast.success('Faculty list refreshed successfully');
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to refresh faculty list');
    } finally {
      setLoading(false);
    }
  };

  // Fetch faculties on component mount
  useEffect(() => {
    async function fetchFaculties() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/faculty');

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to fetch faculty data');
        }

        const data = await res.json();
        setFaculties(data);
        setFilteredFaculties(data); // initialize with all
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch faculty data');
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, [hasEdited]);

  useEffect(() => {
    async function checkRecordsAndFetchAssignments() {
      try {
        const res = await fetch('/api/admin/countrecords');

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to check records');
        }

        const data = await res.json();

        const mentorCount = data.mentors;
        const evaluatorCount = data.evaluators;

        setHasMentors(mentorCount > 0);
        setHasEvaluators(evaluatorCount > 0);

        if (mentorCount > 0 || evaluatorCount > 0) {
          const assignRes = await fetch('/api/admin/checkassignment');

          if (!assignRes.ok) {
            const errorData = await assignRes.json().catch(() => null);
            throw new Error(errorData?.error || 'Failed to fetch assignment data');
          }

          const assignData = await assignRes.json();
          setAssignments(assignData);
        }

        setAssignmentsLoaded(true);
      } catch (error) {
        console.error('Error checking records or fetching assignment data:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load assignment data');
        setAssignmentsLoaded(true);
      }
    }

    checkRecordsAndFetchAssignments();
  }, []);

  const getMentorStatus = (facultyId: number) => {
    if (!assignmentsLoaded) return 'Loading...';

    if (!hasMentors) return 'Pending';

    const assignment = assignments.find((item) => item.facultyId === facultyId);
    return assignment && assignment.assignedMentor === 1 ? 'Assigned' : 'Pending';
  };

  const getEvaluatorStatus = (facultyId: number) => {
    if (!assignmentsLoaded) return 'Loading...';

    if (!hasEvaluators) return 'Pending';

    const assignment = assignments.find((item) => item.facultyId === facultyId);
    return assignment && assignment.evaluatorAssigned === 1 ? 'Assigned' : 'Pending';
  };

  const handleModalclose = () => {
    setShowModal(false);
  };

  const handleModalopen = (item: FacultyWithUser) => {
    setSelectedFaculty(item);
    setShowModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter faculties based on search term and department
  useEffect(() => {
    let result = faculties;

    // Apply department filter
    if (selectedDepartment !== 'ALL') {
      result = result.filter((item) => item.faculty.department === selectedDepartment);
    }

    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (faculty) =>
          (faculty.faculty.name && faculty.faculty.name.toLowerCase().includes(term)) ||
          (faculty.user.email && faculty.user.email.toLowerCase().includes(term))
      );
    }

    setFilteredFaculties(result);
  }, [searchTerm, selectedDepartment, faculties]);

  const handleAddFaculty = () => {
    setShowAdd(true);
  };
  const handleAddFacultyClose = () => {
    setShowAdd(false);
  };

  const handleUploadExcel = () => {
    openUploadModal();
  };

  if (loading) {
    return <FacultyTableSkeleton />;
  }

  return (
    <>
      {showAdd && <AddFacultyModal isOpen={showAdd} onClose={handleAddFacultyClose} />}

      {showModal && selectedFaculty && (
        <FacultyTableModal
          setHasEdit={setHasEdited}
          selectedFaculty={selectedFaculty}
          isOpen={showModal}
          onClose={handleModalclose}
          onCloseCross={handleModalclose}
        />
      )}

      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal} className="md:max-w-4xl">
        <div className="p-10">
          <UploadExcel onSuccess={handleUploadSuccess} type="faculty" />
        </div>
      </Modal>

      {loading}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Faculty Details</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto mb-2 sm:mb-0">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white w-full"
              />
            </div>

            <div>
              <Button size="sm" variant="primary" className="mr-4" onClick={handleAddFaculty}>
                Add Single Faculty
              </Button>
              <Button size="sm" variant="primary" className="mr-4" onClick={handleUploadExcel}>
                Upload Excel
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="ALL">All</option>
                <option value="CSE">CSE</option>
                <option value="CSBS">CSBS</option>
                <option value="ECE">ECE</option>
                <option value="ICT">ICT</option>
                <option value="MECH">MECH</option>
                <option value="BSC-DS">BSC-DS</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-16 md:w-20 text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 text-gray-500 text-start text-theme-base dark:text-gray-400"
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
                  className="py-3 px-4 w-32 md:w-40  whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Sitting
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Free Slots
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Mentor
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 px-4 w-32 md:w-40 whitespace-nowrap font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Evaluator
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredFaculties.length > 0 ? (
                filteredFaculties
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, index) => (
                    <TableRow
                      key={item.faculty.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => {
                        handleModalopen(item);
                      }}
                    >
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.faculty.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.user.email}
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.faculty.department || 'N/A'}
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        {(item.faculty.sitting?.substring(0, 10) && item.faculty.sitting?.substring(0, 10) + '...') ||
                          'N/A'}
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.faculty.freeTimeSlots && item.faculty.freeTimeSlots.length > 0
                          ? item.faculty.freeTimeSlots.join(', ').substring(0, 10) + '...'
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="py-3  px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={getMentorStatus(item.faculty.id) === 'Assigned' ? 'success' : 'warning'}
                        >
                          {getMentorStatus(item.faculty.id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={getEvaluatorStatus(item.faculty.id) === 'Assigned' ? 'success' : 'warning'}
                        >
                          {getEvaluatorStatus(item.faculty.id)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                    No faculty found matching your search criteria
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
}
