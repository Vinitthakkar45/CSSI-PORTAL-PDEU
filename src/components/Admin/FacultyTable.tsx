'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../Home/ui/table';
import Badge from '../Home/ui/badge/Badge';
import { faculty } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import { countEvaluators, countMentors } from './utils/countrecords';
import LoadingOverlay from '../LoadingOverlay';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    email: string | null;
    role: string | null;
  };
};

type AssignmentItem = {
  facultyId: number;
  assignedMentor: number;
  evaluatorAssigned: number;
};

const FacultyTable = () => {
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [hasMentors, setHasMentors] = useState(false);
  const [hasEvaluators, setHasEvaluators] = useState(false);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/faculty');
        const data = await res.json();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, []);

  useEffect(() => {
    async function checkRecordsAndFetchAssignments() {
      try {
        const res = await fetch('/api/admin/countrecords');
        const data = await res.json();

        const mentorCount = data.mentors;
        const evaluatorCount = data.evaluators;

        setHasMentors(mentorCount > 0);
        setHasEvaluators(evaluatorCount > 0);

        if (mentorCount > 0 || evaluatorCount > 0) {
          const res = await fetch('/api/admin/checkassignment');
          const data = await res.json();
          console.log(data);
          setAssignments(data);
        }

        setAssignmentsLoaded(true);
      } catch (error) {
        console.error('Error checking records or fetching assignment data:', error);
        setAssignmentsLoaded(true);
      }
    }

    checkRecordsAndFetchAssignments();
  }, []);

  const getMentorStatus = (facultyId: number) => {
    if (!assignmentsLoaded) return 'Loading...';

    // If no mentors exist yet, everything is pending
    if (!hasMentors) return 'Pending';

    const assignment = assignments.find((item) => item.facultyId === facultyId);
    return assignment && assignment.assignedMentor === 1 ? 'Assigned' : 'Pending';
  };

  const getEvaluatorStatus = (facultyId: number) => {
    if (!assignmentsLoaded) return 'Loading...';

    // If no evaluators exist yet, everything is pending
    if (!hasEvaluators) return 'Pending';

    const assignment = assignments.find((item) => item.facultyId === facultyId);
    return assignment && assignment.evaluatorAssigned === 1 ? 'Assigned' : 'Pending';
  };

  // if (loading) {
  //   return <div className="p-4 text-center">Loading faculty data...</div>;
  // }

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Faculty Details</h3>
          </div>
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
                  User Details
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
                  Sitting Location
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Available Time Slots
                </TableCell>
                {/* <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                Role
              </TableCell> */}
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Mentor Status
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  Evaluator Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {faculties.map((item) => (
                <TableRow key={item.faculty.id} className="">
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.faculty.id}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.faculty.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.user.email}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.faculty.department || 'Not Assigned'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.faculty.sitting || 'Not Assigned'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.faculty.freeTimeSlots && item.faculty.freeTimeSlots.length > 0
                      ? item.faculty.freeTimeSlots.join(', ')
                      : 'No time slots available'}
                  </TableCell>
                  {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={item.user.role === 'admin' ? 'success' : 'warning'}>
                    {item.user.role === 'admin' ? 'Admin' : 'Faculty'}
                  </Badge>
                </TableCell> */}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getMentorStatus(item.faculty.id) === 'Assigned' ? 'success' : 'warning'}>
                      {getMentorStatus(item.faculty.id)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getEvaluatorStatus(item.faculty.id) === 'Assigned' ? 'success' : 'warning'}>
                      {getEvaluatorStatus(item.faculty.id)}
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

export default FacultyTable;
