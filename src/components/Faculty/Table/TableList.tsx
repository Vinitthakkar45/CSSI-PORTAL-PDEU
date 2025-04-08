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

interface Student {
  id: number;
  rollNumber: string;
  department: string;
  name: string;
  email: string;
  divison: string;
  groupNumber: string;
  image: string;
  contactNumber: string;

  // NGO details
  ngoName: string | null;
  ngoCity: string | null;
  ngoDistrict: string | null;
  ngoState: string | null;
  ngoCountry: string | null;
  ngoAddress: string | null;
  ngoNatureOfWork: string | null;
  ngoEmail: string | null;
  ngoPhone: string | null;

  //Project Details
  problemDefinition: string | null;
  proposedSolution: string | null;

  // Status Fields
  ngoChosen: boolean;
  stage: number;
  report: string;
  certificate: string;
  poster: string;
  offerLetter: string;
  mentorMarks: number;
  evaluatorMarks: number;
}

export default function TableList({
  students,
  option, // Prop to determine if the list is for mentoring or evaluating
}: {
  students: Student[];
  option: 'mentor' | 'evaluator';
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStudent, setSelectedStudent] = useState<Student>({
    id: 0,
    rollNumber: '',
    department: '',
    name: '',
    email: '',
    divison: '',
    groupNumber: '',
    image: '',
    contactNumber: '',

    // NGO details
    ngoName: '',
    ngoCity: '',
    ngoDistrict: '',
    ngoState: '',
    ngoCountry: '',
    ngoAddress: '',
    ngoNatureOfWork: '',
    ngoEmail: '',
    ngoPhone: '',

    //Project Details
    problemDefinition: '',
    proposedSolution: '',

    // Status Fields
    ngoChosen: false,
    stage: 0,
    report: '',
    certificate: '',
    poster: '',
    offerLetter: '',
    mentorMarks: 0,
    evaluatorMarks: 0,
  }); // State to store the selected student
  const [marks, setMarks] = useState<number | 0>(0); // State to store marks
  const [reportUrl, setReportUrl] = useState<string>(''); // State to store report URL
  const [certificateUrl, setCertificateUrl] = useState<string>(''); // State to store certificate URL
  const [posterUrl, setPosterUrl] = useState<string>(''); // State to store poster URL
  const [offerLetterUrl, setOfferLetterUrl] = useState<string>(''); // State to store offer letter URL
  const handleOpenModal = async (student: Student, option: 'mentor' | 'evaluator') => {
    setSelectedStudent(student); // Set the selected student
    setMarks(option === 'mentor' ? student.mentorMarks : student.evaluatorMarks); // Set marks field

    try {
      const response = await fetch(`/api/faculty/get-pdf?filePath=${encodeURIComponent(student.report)}`, {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Result:', result);
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setReportUrl(result.signedUrl); // Set the signed URL for the report
      openModal(); // Open the modal
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      alert('Failed to fetch the document. Please try again.');
    }
  };

  const handleSave = async (type: string) => {
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
                          <Image width={40} height={40} src={student.image} alt={student.name} />
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
          <form className="overflow-y-auto max-h-[80vh] no-scrollbar">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Student Details</h4>
            <br />
            {/* Student Image and Basic Details */}
            <div className="flex justify-center gap-20 mb-5">
              <div className="w-40 h-40 overflow-hidden rounded-full">
                <Image width={160} height={160} src={selectedStudent.image} alt={selectedStudent.name} />
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

            {/* Student Dept */}
            <div className="mb-3">
              <Label>Department</Label>
              <Input type="text" value={selectedStudent.department || ''} disabled />
            </div>

            {/* Student Email */}

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <Label>Division</Label>
                <Input type="text" value={selectedStudent.divison || 'N/A'} disabled />
              </div>
              <div>
                <Label>Group</Label>
                <Input type="text" value={selectedStudent.groupNumber || 'N/A'} disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="mb-4">
                <Label>Email</Label>
                <Input type="text" value={selectedStudent.email || ''} disabled />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="text" value={selectedStudent.contactNumber || 'N/A'} disabled />
              </div>
            </div>

            <br />
            {/* NGO Details */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">NGO Details</h5>
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
              <Input type="text" value={selectedStudent.ngoName || 'N/A'} disabled />
            </div>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <Label>District</Label>
                <Input type="text" value={selectedStudent.ngoDistrict || 'N/A'} disabled />
              </div>
              <div>
                <Label>State</Label>
                <Input type="text" value={selectedStudent.ngoDistrict || 'N/A'} disabled />
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

            <br />
            {/* Project Details */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Project Details</h5>

            <div className="mb-4">
              <Label>Problem Statement</Label>
              <Input type="text" value={selectedStudent.problemDefinition || 'N/A'} disabled />
            </div>
            <div className="mb-6">
              <Label>Approach of Solving Problem</Label>
              <Input type="text" value={selectedStudent.proposedSolution || 'N/A'} disabled />
            </div>

            <br />
            {/* Documents */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Documents and Proof of Work</h5>

            <div className="mb-4">
              <Label>Report</Label>
              {/* {selectedStudent.report ?
              <PdfViewer
              fileUrl={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${selectedStudent.report}`}
              height={500}
              width={600}
              />
              :  */}
              <p>{selectedStudent.report} </p>
            </div>

            <div className="mb-4">
              <Label>Certificate</Label>
              {
                /* {selectedStudent.certificate ?
              <PdfViewer fileUrl={selectedStudent.certificate} height={500} width={600} />
              :} */
                // <Input type="text" value={selectedStudent.certificate} disabled />}
              }
              <p>{selectedStudent.certificate} </p>
            </div>

            <div className="mb-4">
              <Label>Poster</Label>
              {/*{ {selectedStudent.poster ?
              <PdfViewer fileUrl={selectedStudent.poster} height={500} width={600} />
              : }*/}
              {/* <Input type="text" value={selectedStudent.poster} disabled /> */}
              <p>{selectedStudent.poster} </p>
            </div>

            <div className="mb-4">
              <Label>Offer Letter</Label>
              {
                /* {selectedStudent.poster ?
              <PdfViewer fileUrl={selectedStudent.offerLetter} height={500} width={600} />
              : }*/
                // <Input type="text" value= {selectedStudent.offerLetter} disabled />
              }
              <p>{selectedStudent.offerLetter} </p>
            </div>

            <br />
            {/* Evaluation Section */}
            <h5 className="mb-4 text-md font-medium text-gray-800 dark:text-white/90">Evaluation</h5>

            {option === 'mentor' ? (
              <div className="mb-6">
                <Label>{'Internal Marks'}</Label>
                <Input
                  type="number"
                  value={marks || ''} // Use empty string as fallback for null or undefined
                  onChange={(e) => setMarks(Number(e.target.value) || 0)}
                  placeholder={`${option === 'mentor' ? 'Enter the internal marks' : 'To be entered by the Mentor'}`}
                />
              </div>
            ) : null}

            {option === 'mentor' ? null : (
              <div className="mb-6">
                <Label>{'Final Marks'}</Label>
                <Input
                  type="number"
                  value={marks || ''} // Use empty string as fallback for null or undefined
                  onChange={(e) => setMarks(Number(e.target.value) || 0)}
                  placeholder={'Enter the final marks'}
                  // disabled={false}
                />
              </div>
            )}

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={savemarks}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
