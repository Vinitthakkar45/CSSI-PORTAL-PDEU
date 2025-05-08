import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Home/ui/modal';
import Button from '@/components/Home/ui/button/Button';
import Label from '@/components/Home/form/Label';
import Input from '@/components/Home/form/input/InputField';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SelectStudent } from '@/drizzle/schema';
import { ExternalLink } from 'lucide-react';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/Home/ui/toast/Toast';
import StudentModalSkele from '@/components/Coordinator/Skeletons/StudentModalSkele';
export default function StudentModal({
  isOpen,
  onClose,
  selectedStudent,
  option,
  setMarksToggle,
  marksToggle,
  students,
  setStudents,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: SelectStudent;
  option: 'mentor' | 'evaluator';
  setMarksToggle: React.Dispatch<React.SetStateAction<boolean>>;
  marksToggle: boolean;
  students: SelectStudent[];
  setStudents: React.Dispatch<React.SetStateAction<SelectStudent[]>>;
}) {
  const { data: session } = useSession(); // Get faculty ID from session
  const [savingMarks, setSavingMarks] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [mentorname, setMentorName] = useState('');
  const [evalname, setEvalName] = useState('');
  const [marks, setMarks] = useState({
    posterOrganization: 0,
    dayToDayActivity: 0,
    contributionToWork: 0,
    learningOutcomes: 0,
    geoTagPhotos: 0,
    reportOrganization: 0,
    certificate: 0,
    learningExplanation: 0,
    problemIdentification: 0,
    contributionExplanation: 0,
    proposedSolution: 0,
    presentationSkills: 0,
    qnaViva: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reportUrl, setReportUrl] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [offerLetterUrl, setOfferLetterUrl] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const tabs = ['personal', 'ngo', 'project', 'documents', 'evaluation'];

  useEffect(() => {
    if (selectedStudent) {
      //   setMarks(option === 'mentor' ? selectedStudent.internal_evaluation_marks : selectedStudent.final_evaluation_marks);
      setCertificateUrl(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/Certificate/${selectedStudent.userId}.pdf`
      );
      setOfferLetterUrl(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/OfferLetter/${selectedStudent.userId}.pdf`
      );
      setPosterUrl(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/Poster/${selectedStudent.userId}.pdf`
      );
      setReportUrl(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/Report/${selectedStudent.userId}.pdf`
      );

      setMarks({
        posterOrganization: selectedStudent.posterOrganization || 0,
        dayToDayActivity: selectedStudent.dayToDayActivity || 0,
        contributionToWork: selectedStudent.contributionToWork || 0,
        learningOutcomes: selectedStudent.learningOutcomes || 0,
        geoTagPhotos: selectedStudent.geotagPhotos || 0,
        reportOrganization: selectedStudent.reportOrganization || 0,
        certificate: selectedStudent.hardCopyCertificate || 0,
        learningExplanation: selectedStudent.learningExplanation || 0,
        problemIdentification: selectedStudent.problemIndentification || 0,
        contributionExplanation: selectedStudent.contributionExplanation || 0,
        proposedSolution: selectedStudent.proposedSolutionExplanation || 0,
        presentationSkills: selectedStudent.presentationSkill || 0,
        qnaViva: selectedStudent.qnaMarks || 0,
      });
    }
  }, [selectedStudent]);

  const marksSchema = z.object({
    posterOrganization: z.number().min(0).max(10),
    dayToDayActivity: z.number().min(0).max(10),
    contributionToWork: z.number().min(0).max(5),
    learningOutcomes: z.number().min(0).max(5),
    geoTagPhotos: z.number().min(0).max(5),
    reportOrganization: z.number().min(0).max(10),
    certificate: z.number().min(0).max(5),
    learningExplanation: z.number().min(0).max(5),
    problemIdentification: z.number().min(0).max(5),
    contributionExplanation: z.number().min(0).max(10),
    proposedSolution: z.number().min(0).max(10),
    presentationSkills: z.number().min(0).max(10),
    qnaViva: z.number().min(0).max(10),
  });

  const validateMarks = () => {
    const result = marksSchema.safeParse(marks);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handlePrevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
  };

  const handleSave = async (type: string) => {
    if (!selectedStudent || !validateMarks()) {
      toast.warning('Please fix validation errors before saving.');
      return;
    }
    setSavingMarks(true);

    const typeofmarks = option === 'mentor' ? 'internal' : 'final';
    const studentid = selectedStudent.id;

    try {
      const response = await fetch(`/api/coord/evaluate?facultyId=${session?.user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentid, typeofmarks, marks }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      const updated = students.map((student) => {
        if (student.id === studentid) {
          if (typeofmarks === 'internal') {
            student.posterOrganization = marks.posterOrganization;
            student.dayToDayActivity = marks.dayToDayActivity;
            student.contributionToWork = marks.contributionToWork;
            student.learningOutcomes = marks.learningOutcomes;
            student.geotagPhotos = marks.geoTagPhotos;
            student.reportOrganization = marks.reportOrganization;
            student.hardCopyCertificate = marks.certificate;
          } else if (typeofmarks === 'final') {
            student.learningExplanation = marks.learningExplanation;
            student.problemIndentification = marks.problemIdentification;
            student.contributionExplanation = marks.contributionExplanation;
            student.proposedSolutionExplanation = marks.proposedSolution;
            student.presentationSkill = marks.presentationSkills;
            student.qnaMarks = marks.qnaViva;
          }
        }
        return student;
      });
      toast.success('Marks Saved Successfully');
      setSavingMarks(false);

      setStudents(updated);
      setMarksToggle(!marksToggle);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save marks');
    }
  };

  function savemarks() {
    if (option === 'mentor') {
      handleSave('mentor');
    } else {
      handleSave('evaluator');
    }
    setMarksToggle(!marksToggle);
  }

  const handleInputChange = (field: keyof typeof marks, value: string, upperlim: number) => {
    if (value === '') {
      setMarks((prevMarks) => ({
        ...prevMarks,
        [field]: 0,
      }));
      return;
    }
    if (Number(value) <= upperlim && Number(value) >= 0) {
      setMarks((prevMarks) => ({
        ...prevMarks,
        [field]: Number(value),
      }));
    }
  };

  const handleDeclineOfferLetter = async () => {
    if (!selectedStudent || !session?.user?.id) return;

    setIsDeclining(true);

    try {
      const response = await fetch(
        `/api/coord/decline-offer-letter?facultyId=${session?.user.id}&email=${session?.user.email}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_user_id: selectedStudent.userId,
            reason_of_declination: declineReason,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to decline offer letter');

      toast.success('Offer letter declined successfully');
      setShowDeclineInput(false);
      setDeclineReason('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to decline offer letter');
    } finally {
      setIsDeclining(false);
    }
  };

  useEffect(() => {
    async function fetchMentorAndEvaluator() {
      if (!selectedStudent || !session?.user?.id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/mentorandevaluator`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedStudent.userId,
          }),
        });
        const data = await response.json();
        setMentorName(data.mentorname?.name ?? 'Not assigned');
        setEvalName(data.evalname?.name ?? 'Not assigned');
      } catch (err) {
        toast.error('issue while fetching');
      } finally {
        setLoading(false);
      }
    }
    fetchMentorAndEvaluator();
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-5 lg:p-10">
      {loading ? (
        <StudentModalSkele />
      ) : (
        selectedStudent && (
          <div className="overflow-y-auto max-h-[80vh] no-scrollbar">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Student Details</h4>

            {/* Tabs */}
            <div className="flex  justify-between max-w-[600px] ">
              <button
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 disabled:opacity-50"
                onClick={handlePrevTab}
                disabled={tabs.indexOf(activeTab) === 0}
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <button
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 disabled:opacity-50"
                onClick={handleNextTab}
                disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row  mb-7">
              <div className="hidden sm:flex whitespace-nowrap overflow-hidden text-ellipsis justify-center items-center no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium max-w-[450px] ${
                      activeTab === tab
                        ? 'border-b-2  border-blue-500 text-blue-500'
                        : ' border-b-2 border-gray-400 text-gray-400'
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
                            ? 'Proof of Work'
                            : 'Evaluation'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <div>
                <p className="mb-5 text-gray-400 text-center">
                  <i> Personal Details </i>
                </p>
                {/* Personal Details */}
                <div className="flex justify-center gap-20 mb-5">
                  <div className="w-40 h-40 overflow-hidden rounded-full">
                    <Image
                      width={160}
                      height={160}
                      src={
                        selectedStudent.profileImage
                          ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedStudent.profileImage}`
                          : '/images/user/DefaultProfile_Light.png'
                      }
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
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label>Mentor</Label>
                    <Input type="text" value={mentorname} disabled />
                  </div>
                  <div>
                    <Label>Evaluator</Label>
                    <Input type="text" value={evalname} disabled />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ngo' && (
              <div>
                {/* NGO Details */}
                <p className="mb-5 text-gray-400 text-center">
                  <i> Registered NGO Details </i>
                </p>

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
                <p className="mb-5 text-gray-400 text-center">
                  <i> Details of undergoing project </i>
                </p>
                <div className="mb-4">
                  <Label> Problem Statement </Label>
                  <Input type="text" value={selectedStudent.problemDefinition || 'N/A'} disabled />
                </div>
                <div className="mb-6">
                  <Label> Approach of Solving Problem </Label>
                  <Input type="text" value={selectedStudent.proposedSolution || 'N/A'} disabled />
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <p className="mb-5 text-gray-400 text-center">
                  <i> Documents Uploaded </i>
                </p>
                <div className="flex mb-4">
                  <div className="mb-4 ml-6 w-1/2">
                    <Label>Week 1 Photo</Label>
                    <div className="ml-4">
                      {selectedStudent.week_one_photo ? (
                        <a
                          href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedStudent.week_one_photo}`}
                          target="_blank"
                        >
                          <Image
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedStudent.week_one_photo}`}
                            alt="Week 1 Photo"
                            width={160}
                            height={160}
                            className=" rounded-lg"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">Not yet uploaded</span>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 ml-6 w-1/2">
                    <Label>Week 2 Photo</Label>
                    <div className="ml-4">
                      {selectedStudent.week_two_photo ? (
                        <a
                          href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedStudent.week_two_photo}`}
                          target="_blank"
                        >
                          <Image
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedStudent.week_two_photo}`}
                            alt="Week 2 Photo"
                            width={160}
                            height={160}
                            className="rounded-lg"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">Not yet uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 ml-6">
                  <Label>Offer Letter</Label>
                  <div>
                    {selectedStudent.offerLetter ? (
                      <div>
                        <a
                          href={offerLetterUrl}
                          target="_blank"
                          className="flex text-gray-700 dark:text-gray-200 mt-1 ml-4"
                        >
                          {' '}
                          View Offer Letter <ExternalLink className="ml-1 mt-1" size={16} strokeWidth={2.5} />
                        </a>
                        {!showDeclineInput && option === 'mentor' && (
                          <button
                            className="mt-2 ml-4 px-4 py-2 text-sm font-medium text-white bg-red-900 rounded hover:bg-red-800"
                            onClick={() => setShowDeclineInput(true)}
                          >
                            Decline Offer Letter
                          </button>
                        )}
                        {showDeclineInput && option === 'mentor' && (
                          <div className="mt-4 ml-4">
                            <Label>Reason for Declination</Label>
                            <textarea
                              className="w-full p-2 mt-2 border border-gray-300 rounded"
                              rows={3}
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                              placeholder="Enter reason for declining the offer letter"
                            />
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                className={`px-4 py-2 text-sm font-medium text-white rounded ${
                                  declineReason ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                                }`}
                                onClick={handleDeclineOfferLetter}
                                disabled={!declineReason || isDeclining}
                              >
                                {isDeclining ? 'Sending...' : 'Send'}
                              </button>
                              <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => {
                                  setShowDeclineInput(false);
                                  setDeclineReason('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">
                        Offer Letter is not yet uploaded by the student
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-4 ml-6">
                  <Label>Report</Label>
                  <p>
                    {selectedStudent.report ? (
                      <a href={reportUrl} target="_blank" className="flex text-gray-700 dark:text-gray-200 mt-1 ml-4">
                        {' '}
                        View Report <ExternalLink className="ml-1 mt-1" size={16} strokeWidth={2.5} />{' '}
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">
                        Report is not yet uploaded by the student
                      </span>
                    )}
                  </p>
                </div>
                <div className="mb-4 ml-6">
                  <Label>Certificate</Label>
                  <p>
                    {selectedStudent.certificate ? (
                      <a
                        href={certificateUrl}
                        target="_blank"
                        className="flex text-gray-700 dark:text-gray-200 mt-1 ml-4"
                      >
                        {' '}
                        View Certificate <ExternalLink className="ml-1 mt-1" size={16} strokeWidth={2.5} />{' '}
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">
                        Certificate is not yet uploaded by the student
                      </span>
                    )}
                  </p>
                </div>
                <div className="mb-4 ml-6">
                  <Label>Poster</Label>
                  <p>
                    {selectedStudent.poster ? (
                      <a href={posterUrl} target="_blank" className="flex text-gray-700 dark:text-gray-200 mt-1 ml-4">
                        {' '}
                        View Poster <ExternalLink className="ml-1 mt-1" size={16} strokeWidth={2.5} />{' '}
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 mt-1 ml-4">
                        Poster is not yet uploaded by the student
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div>
                {/* Evaluation */}
                {option === 'mentor' ? (
                  <div>
                    <h3 className="mb-4">Poster Organization</h3>

                    <div className="mb-6 grid grid-cols-2 grid-rows-3 gap-6">
                      <div>
                        <Label>{'Poster Organization'}</Label>
                        <Input
                          error={marks.posterOrganization < 0 || marks.posterOrganization > 10 ? true : false}
                          id="posterOrganization"
                          name="posterOrganization"
                          type="text"
                          value={marks.posterOrganization || ''}
                          onChange={(e) => handleInputChange('posterOrganization', e.target.value, 10)}
                          placeholder="Marks - out of 10"
                        />
                      </div>
                      <div>
                        <Label>{'Day To Day Activity'}</Label>
                        <Input
                          error={marks.dayToDayActivity < 0 || marks.dayToDayActivity > 10 ? true : false}
                          type="text"
                          value={marks.dayToDayActivity || ''}
                          onChange={(e) => handleInputChange('dayToDayActivity', e.target.value, 10)}
                          placeholder="Marks - out of 10"
                        />
                      </div>
                      <div>
                        <Label>{'Contribution to Work'}</Label>
                        <Input
                          error={marks.contributionToWork < 0 || marks.contributionToWork > 5 ? true : false}
                          type="text"
                          value={marks.contributionToWork || ''}
                          onChange={(e) => handleInputChange('contributionToWork', e.target.value, 5)}
                          placeholder="Marks - out of 5"
                        />
                      </div>
                      <div>
                        <Label>{'Learning Outcomes'}</Label>
                        <Input
                          error={marks.learningOutcomes < 0 || marks.learningOutcomes > 5 ? true : false}
                          type="text"
                          value={marks.learningOutcomes || ''}
                          onChange={(e) => handleInputChange('learningOutcomes', e.target.value, 5)}
                          placeholder="Marks - out of 5"
                        />
                      </div>
                      <div>
                        <Label>{'GeoTag Photos'}</Label>
                        <Input
                          error={marks.geoTagPhotos < 0 || marks.geoTagPhotos > 5 ? true : false}
                          type="text"
                          value={marks.geoTagPhotos || ''}
                          onChange={(e) => handleInputChange('geoTagPhotos', e.target.value, 5)}
                          placeholder="Marks - out of 5"
                        />
                      </div>
                      <div></div>
                    </div>

                    <h3 className="mb-4">Report Organization / Certificate</h3>

                    <div className="mb-6 grid grid-cols-2 grid-rows-1 gap-6">
                      <div>
                        <Label>{'Report Organization'}</Label>
                        <Input
                          error={marks.reportOrganization < 0 || marks.reportOrganization > 10 ? true : false}
                          type="text"
                          value={marks.reportOrganization || ''}
                          onChange={(e) => handleInputChange('reportOrganization', e.target.value, 10)}
                          placeholder="Marks - out of 10"
                        />
                      </div>
                      <div>
                        <Label>{'Hard Copy Certificate'}</Label>
                        <Input
                          error={marks.learningExplanation < 0 || marks.learningExplanation > 5 ? true : false}
                          type="text"
                          value={marks.certificate || ''}
                          onChange={(e) => handleInputChange('certificate', e.target.value, 5)}
                          placeholder="Marks - out of 5"
                        />
                      </div>
                    </div>
                    <div>
                      <p>
                        Total Marks:{' '}
                        {marks.posterOrganization +
                          marks.dayToDayActivity +
                          marks.contributionToWork +
                          marks.learningOutcomes +
                          marks.geoTagPhotos +
                          marks.reportOrganization +
                          marks.certificate}{' '}
                        / 50
                      </p>
                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                      <Button size="sm" variant="outline" onClick={onClose}>
                        Close
                      </Button>
                      <Button size="sm" onClick={savemarks}>
                        {savingMarks ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <h3 className="mb-4">Presentation</h3>

                      <div className="mb-6 grid grid-cols-2 grid-rows-3 gap-6">
                        <div>
                          <Label>{'Learning Explanation'}</Label>
                          <Input
                            error={marks.learningExplanation < 0 || marks.learningExplanation > 5 ? true : false}
                            type="text"
                            value={marks.learningExplanation || ''}
                            onChange={(e) => handleInputChange('learningExplanation', e.target.value, 5)}
                            placeholder="Marks - out of 5"
                          />
                        </div>
                        <div>
                          <Label>{'Problem Identification'}</Label>
                          <Input
                            error={marks.problemIdentification < 0 || marks.problemIdentification > 5}
                            type="text"
                            value={marks.problemIdentification || ''}
                            onChange={(e) => handleInputChange('problemIdentification', e.target.value, 5)}
                            placeholder="Marks - out of 5"
                          />
                        </div>
                        <div>
                          <Label>{'Contribution Explanation'}</Label>
                          <Input
                            error={marks.contributionExplanation < 0 || marks.contributionExplanation > 10}
                            type="text"
                            value={marks.contributionExplanation || ''}
                            onChange={(e) => handleInputChange('contributionExplanation', e.target.value, 10)}
                            placeholder="Marks - out of 10"
                          />
                        </div>
                        <div>
                          <Label>{'Proposed Solution'}</Label>
                          <Input
                            error={marks.proposedSolution < 0 || marks.proposedSolution > 10}
                            type="text"
                            value={marks.proposedSolution || ''}
                            onChange={(e) => handleInputChange('proposedSolution', e.target.value, 10)}
                            placeholder="Marks - out of 10"
                          />
                        </div>
                        <div>
                          <Label>{'Presenatation Skills'}</Label>
                          <Input
                            error={marks.presentationSkills < 0 || marks.presentationSkills > 10}
                            type="text"
                            value={marks.presentationSkills || ''}
                            onChange={(e) => handleInputChange('presentationSkills', e.target.value, 10)}
                            placeholder="Marks - out of 10"
                          />
                        </div>
                        <div></div>
                      </div>

                      <h3 className="mb-4">Question and Anwser</h3>

                      <div className="mb-6 grid grid-cols-2 grid-rows-1 gap-6">
                        <div>
                          <Label>{'QnA Viva'}</Label>
                          <Input
                            error={marks.qnaViva < 0 || marks.qnaViva > 10}
                            type="text"
                            value={marks.qnaViva || ''}
                            onChange={(e) => handleInputChange('qnaViva', e.target.value, 10)}
                            placeholder="Marks - out of 10"
                          />
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div>
                      <p>
                        Total Marks:{' '}
                        {marks.learningExplanation +
                          marks.problemIdentification +
                          marks.contributionExplanation +
                          marks.proposedSolution +
                          marks.presentationSkills +
                          marks.qnaViva}{' '}
                        / 50
                      </p>
                    </div>
                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                      <Button size="sm" variant="outline" onClick={onClose}>
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
        )
      )}
    </Modal>
  );
}
