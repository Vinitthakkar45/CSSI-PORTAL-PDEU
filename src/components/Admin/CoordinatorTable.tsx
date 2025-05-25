'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import { faculty } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import FacultyTableModal from './FacultyTableModal';
import CoordinatorTableSkeleton from './skeletons/CoordinatorTableSkele';

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

const CoordinatorTable = () => {
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<FacultyWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyWithUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hasEdited, setHasEdited] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/coordinator');
        const data = await res.json();
        setFaculties(data);
        setFilteredFaculties(data);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, [hasEdited]);

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

  if (loading) {
    return <CoordinatorTableSkeleton />;
  }

  return (
    <>
      {showModal && selectedFaculty && (
        <FacultyTableModal
          setHasEdit={setHasEdited}
          selectedFaculty={selectedFaculty}
          isOpen={showModal}
          onClose={handleModalclose}
          onCloseCross={handleModalclose}
        ></FacultyTableModal>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Coordinator Details</h3>
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
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((item, index) => (
                  <TableRow
                    key={item.faculty.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => {
                      handleModalopen(item);
                    }}
                  >
                    <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                      {index + 1}
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
                      {item.faculty.department || 'Not Assigned'}
                    </TableCell>
                    <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.faculty.sitting || 'N/A'}
                    </TableCell>
                    <TableCell className="py-3 px-4 truncate text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.faculty.freeTimeSlots && item.faculty.freeTimeSlots.length > 0
                        ? item.faculty.freeTimeSlots.join(', ')
                        : 'N/A'}
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
      </div>
    </>
  );
};

export default CoordinatorTable;
