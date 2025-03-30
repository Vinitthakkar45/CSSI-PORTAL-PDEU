'use client';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../Home/ui/table';
import Badge from '../Home/ui/badge/Badge';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { student, user, faculty } from '@/drizzle/schema'; // Correct import
import { InferSelectModel } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { mentorAssignment } from '../../../utils/mentorassign';

// interface Product {
//   id: number; // Unique identifier for each product
//   name: string; // Product name
//   variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
//   category: string; // Category of the product
//   price: string; // Price of the product (as a string with currency symbol)
//   // status: string; // Status of the product
//   image: string; // URL or path to the product image
//   status: 'Delivered' | 'Pending' | 'Canceled'; // Status of the product
// }

// const tableData: Product[] = [
//   {
//     id: 1,
//     name: 'MacBook Pro 13”',
//     variants: '2 Variants',
//     category: 'Laptop',
//     price: '$2399.00',
//     status: 'Delivered',
//     image: '/images/product/product-01.jpg', // Replace with actual image URL
//   },
// ];

// Define a type for the joined student and user data
type StudentWithUser = {
  student: InferSelectModel<typeof student>;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

const Dashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  // Specify the type for students state
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [filterType, setFilterType] = useState('students');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click was outside the dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    async function fetchPersonnel() {
      try {
        let data;
        if (filterType === 'students') {
          const res = await fetch('/api/students');
          data = await res.json();
          console.log('API Response (Students):', data);
          setStudents(data);
          console.log('Personnel State (Students):', students);
        } else if (filterType === 'faculty') {
          const res = await fetch('/api/faculty');
          data = await res.json();
          console.log('API Response (Faculty):', data);
          setFaculties(data);
          console.log('Personnel State (Faculty):', faculties);
        }
      } catch (error) {
        console.error('Error fetching personnel:', error);
        // Handle the error appropriately (e.g., display an error message)
      }
    }

    fetchPersonnel();
  }, [filterType]); // Removed setFilterType from dependencies

  function handleFilterChange(type: string) {
    setFilterType(type);
    console.log('Filter Type:', type);
  }

  function handleDropdownToggle() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleAssignMentors = async () => {
    try {
      const response = await fetch('/api/assignmentor', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert('Mentor Assignment Successful!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Something went wrong.');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {filterType === 'students' ? 'Student Details' : 'Faculty Details'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                onClick={() => {
                  handleDropdownToggle();
                }}
              >
                <svg
                  className="stroke-current fill-white dark:fill-gray-800"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.29004 5.90393H17.7067"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.7075 14.0961H2.29085"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {filterType === 'students' ? 'Students' : 'Faculties'}
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-40 rounded-md shadow-lg border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={() => handleFilterChange('students')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'student' ? 'font-bold text-gray-900' : 'text-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white hover:rounded`}
                      role="menuitem"
                    >
                      Student
                    </button>
                    <button
                      onClick={() => handleFilterChange('faculty')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'faculty' ? 'font-bold text-gray-900' : 'text-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white hover:rounded`}
                      role="menuitem"
                    >
                      Faculties
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              See all
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header - Dynamic based on filterType */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-base dark:text-gray-400">
                  ID
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  {filterType === 'students' ? 'Roll Number' : 'User Details'}
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
                {filterType === 'students' ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                >
                  {filterType === 'students' ? 'Status' : 'Mentor'}
                </TableCell>
                {filterType === 'faculty' && (
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
                  >
                    Evaluator
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body - Conditional based on filterType */}
            {filterType === 'students' ? (
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((item) => (
                  <TableRow key={item.student.id} className="">
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
                      {item.student.ngoLocation}
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
            ) : filterType === 'faculty' ? (
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {faculties.map((item) => (
                  <TableRow key={item.faculty.id} className="">
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.faculty.id}
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.user.name}</p>
                          {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">{item.user.email}</span> */}
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
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={item.user.role === 'admin' ? 'success' : 'warning'}>
                        {item.user.role === 'admin' ? 'Admin' : 'Faculty'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={item.user.role === 'admin' ? 'success' : 'warning'}>
                        {item.user.role === 'admin' ? 'Admin' : 'Faculty'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>
        </div>
      </div>
      <button
        className="m-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        onClick={() => handleAssignMentors()}
      >
        Assign Mentor
      </button>
      <button className="m-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
        Assign Faculty
      </button>
      {/* <div className="text-amber-100">
        <p>ADMIN DASHBOARD</p>
        <p>Welcome, {session?.user?.role}!</p>
        <p>Welcome, {session?.user?.email}!</p>
        <p>Welcome, {session?.user?.name}!</p>
        <p>Welcome, {session?.user?.id}!</p>
      </div> */}
    </>
  );
};

export default Dashboard;
