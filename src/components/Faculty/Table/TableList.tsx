import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table';
import Badge from '../../Home/ui/badge/Badge';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/Home/ui/button/Button';
import { Modal } from '@/components/Home/ui/modal';
import Label from '@/components/Home/form/Label';
import Input from '@/components/Home/form/input/InputField';
import PdfViewer from '@/components/PdfViewer';
import { co } from '@fullcalendar/core/internal-common';
import { SelectStudent } from '@/drizzle/schema';

export default function TableList({
  students,
  option, // Prop to determine if the list is for mentoring or evaluating
  setMarksToggle, // Function to update marksToggle state
  marksToggle, // Boolean state to toggle marks
  setStudents,
  // setLoading,
}: {
  students: SelectStudent[];
  option: 'mentor' | 'evaluator';
  setMarksToggle: React.Dispatch<React.SetStateAction<boolean>>;
  marksToggle: boolean;
  setStudents: React.Dispatch<React.SetStateAction<SelectStudent[]>>;
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStudent, setSelectedStudent] = useState<SelectStudent>(); // State to store the selected student
  const [marks, setMarks] = useState<number | null>(0); // State to store marks
  const [reportUrl, setReportUrl] = useState<string>(''); // State to store report URL
  const [certificateUrl, setCertificateUrl] = useState<string>(''); // State to store certificate URL
  const [posterUrl, setPosterUrl] = useState<string>(''); // State to store poster URL
  const [offerLetterUrl, setOfferLetterUrl] = useState<string>(''); // State to store offer letter URL
  const [activeTab, setActiveTab] = useState<string>('personal'); // State for active tab

  const tabs = ['personal', 'ngo', 'project', 'documents', 'evaluation'];

  const handlePrevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleOpenModal = async (student: SelectStudent, option: 'mentor' | 'evaluator') => {
    setSelectedStudent(student); // Set the selected student
    setMarks(option === 'mentor' ? student.internal_evaluation_marks : student.final_evaluation_marks); // Set marks field
    setCertificateUrl(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${student.certificate}`
    ); // Set certificate URL
    console.log(certificateUrl);
    setOfferLetterUrl(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${student.offerLetter}`
    );
    setPosterUrl(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${student.poster}`
    );
    setReportUrl(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${student.report}`
    );
    openModal();
  };

  const handleSave = async (type: string) => {
    // setLoading(true);
    if (!selectedStudent || marks === 0) {
      alert('Please enter marks before saving.');
      return;
    }

    const typeofmarks = (await type) === 'mentor' ? 'internal' : 'final';
    const studentid = await selectedStudent.id;
    // console.log('Saving marks:', { studentid, typeofmarks, marks });
    try {
      const response = await fetch('/api/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, typeofmarks, marks }),
      });

      // console.log('Response:', response);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      students.forEach((student) => {
        if (student == selectedStudent) {
          if (typeofmarks === 'internal') {
            student.internal_evaluation_marks = marks;
          } else {
            student.final_evaluation_marks = marks;
          }
        }
      });

      setStudents(students);
      // setLoading(false);

      console.log('Marks saved successfully!');
      // closeModal(); // Close modal on successful submission
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || 'Failed to save marks');
      } else {
        alert('Failed to save marks');
      }
    }
  };

  function savemarks() {
    if (option === 'mentor') {
      handleSave('mentor');
    } else {
      handleSave('evaluator');
    }
    setMarksToggle(!marksToggle);
    closeModal();
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Student
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Roll Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    NGO Selection
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    NGO
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {students.map((student) => (
                  <TableRow
                    className="hover:cursor-pointer"
                    key={student.id}
                    onClick={() => handleOpenModal(student, option)}
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={student.profileImage || '/images/user/user-17.jpg'}
                            alt={student.name || ''}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {student.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.department}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-5 lg:p-10">
        {selectedStudent && (
          <div className="overflow-y-auto max-h-[80vh] no-scrollbar">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Student Details</h4>

            {/* Tabs */}
            <div className="flex  justify-between">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-500"
                onClick={handlePrevTab}
                disabled={tabs.indexOf(activeTab) === 0}
              >
                &lt; Prev
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-500"
                onClick={handleNextTab}
                disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              >
                Next &gt;
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:border-b mb-7">
              <div className="hidden sm:flex">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'personal'
                      ? 'Personal Details'
                      : tab === 'ngo'
                        ? 'NGO Details'
                        : tab === 'project'
                          ? 'Project Details'
                          : tab === 'documents'
                            ? 'Documents and Proof of Work'
                            : 'Evaluation'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <div>
                {/* Personal Details */}
                <div className="flex justify-center gap-20 mb-5">
                  <div className="w-40 h-40 overflow-hidden rounded-full">
                    <Image
                      width={160}
                      height={160}
                      src={selectedStudent.profileImage || '/images/user/user-17.jpg'}
                      alt={selectedStudent.name || ''}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-4">
                      <Label>Name</Label>
                      <Input type="text" value={selectedStudent.name || ''} disabled />
                    </div>
                    <div className="mb-4">
                      <Label>Roll Number</Label>
                      <Input type="text" value={selectedStudent.rollNumber || ''} disabled />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <Label>Department</Label>
                  <Input type="text" value={selectedStudent.department || ''} disabled />
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label>Division</Label>
                    <Input type="text" value={selectedStudent.division || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Group</Label>
                    <Input type="text" value={selectedStudent.groupNumber || 'N/A'} disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="text" value={selectedStudent.email || ''} disabled />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input type="text" value={selectedStudent.contactNumber || 'N/A'} disabled />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ngo' && (
              <div>
                {/* NGO Details */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label>NGO Name</Label>
                    <Input type="text" value={selectedStudent.ngoName || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input type="text" value={selectedStudent.ngoCity || 'N/A'} disabled />
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Field of Work</Label>
                  <Input type="text" value={selectedStudent.ngoNatureOfWork || 'N/A'} disabled />
                </div>
                <div className="mb-4">
                  <Label>Address</Label>
                  <Input type="text" value={selectedStudent.ngoAddress || 'N/A'} disabled />
                </div>
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <Label>District</Label>
                    <Input type="text" value={selectedStudent.ngoDistrict || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input type="text" value={selectedStudent.ngoState || 'N/A'} disabled />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input type="text" value={selectedStudent.ngoCountry || 'N/A'} disabled />
                  </div>
                </div>
                <div className="mb-6">
                  <Label>NGO Phone Number</Label>
                  <Input type="text" value={selectedStudent.ngoPhone || 'N/A'} disabled />
                </div>
              </div>
            )}

            {activeTab === 'project' && (
              <div>
                {/* Project Details */}
                <div className="mb-4">
                  <Label>Problem Statement</Label>
                  <Input type="text" value={selectedStudent.problemDefinition || 'N/A'} disabled />
                </div>
                <div className="mb-6">
                  <Label>Approach of Solving Problem</Label>
                  <Input type="text" value={selectedStudent.proposedSolution || 'N/A'} disabled />
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                {/* Documents */}
                <div className="mb-4">
                  {/* <Label>Report</Label> */}
                  <p>
                    <a href={reportUrl}> Report </a>
                  </p>
                </div>
                <div className="mb-4">
                  {/* <Label>Certificate</Label> */}
                  <p>
                    <a href={certificateUrl}> Certificate </a>
                  </p>
                </div>
                <div className="mb-4">
                  {/* <Label>Poster</Label> */}
                  {/* <p>{selectedStudent.poster || 'No Poster Uploaded'}</p> */}
                  <p>
                    <a href={posterUrl}> Poster </a>
                  </p>
                </div>
                <div className="mb-4">
                  {/* <Label><a href={offerLetterUrl}> Offer Letter </a></Label> */}
                  <p>
                    <a href={offerLetterUrl}> Offer Letter </a>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div>
                {/* Evaluation */}
                {option === 'mentor' ? (
                  <div>
                    <div className="mb-6">
                      <Label>{'Internal Marks'}</Label>
                      <Input
                        type="number"
                        value={marks || ''}
                        onChange={(e) => setMarks(Number(e.target.value) || 0)}
                        placeholder="Enter the internal marks"
                      />
                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                      <Button size="sm" variant="outline" onClick={closeModal}>
                        Close
                      </Button>
                      <Button size="sm" onClick={savemarks}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <Label>{'Final Marks'}</Label>
                      <Input
                        type="number"
                        value={marks || ''}
                        onChange={(e) => setMarks(Number(e.target.value) || 0)}
                        placeholder="Enter the final marks"
                      />
                    </div>
                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                      <Button size="sm" variant="outline" onClick={closeModal}>
                        Close
                      </Button>
                      <Button size="sm" onClick={savemarks}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
