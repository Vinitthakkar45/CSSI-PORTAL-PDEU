import React, { useState, useEffect } from 'react';
import Button from '@/components/Home/ui/button/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/components/Home/ui/toast/Toast';
import { useSession } from 'next-auth/react';
import { FeedbackData } from '@/types/feedback';

interface FeedbackFormProps {
  onComplete: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onComplete }) => {
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FeedbackData>({
    internshipDurationWeeks: null,
    internshipLocation: '',
    gender: '',
    civicResponsibility: null,
    societalAwareness: null,
    engineeringToSociety: null,
    socialResponsibility: null,
    ngoUnderstanding: null,
    problemIdentification: null,
    analyticalThinking: null,
    toolApplication: null,
    incompleteDataHandling: null,
    collaborationSkills: null,
    communicationSkills: null,
    confidenceDiversity: null,
    timeManagement: null,
    careerInfluence: null,
    initiativeConfidence: null,
    usedDataForms: false,
    usedSpreadsheets: false,
    usedMobileApps: false,
    usedProgrammingTools: false,
    programmingToolsName: '',
    usedIoTDevices: false,
    noneOfAbove: false,
    academicHelpfulness: '',
    academicHelpExplanation: '',
    realWorldProblem: '',
    problemSolution: '',
    futureEngagement: '',
    recommendInternship: '',
    recommendationReason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/feedback/checkfeedbackexists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHasSubmitted(data.hasSubmitted);
        } else {
          console.error('Failed to check submission status');
          setHasSubmitted(false);
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
        setHasSubmitted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubmissionStatus();
  }, [userId]);

  const steps = [
    { id: 1, title: 'Basic Info', shortLabel: 'Info' },
    { id: 2, title: 'Civic Awareness', shortLabel: 'Civic' },
    { id: 3, title: 'Problem Solving', shortLabel: 'Problem' },
    { id: 4, title: 'Personal Development', shortLabel: 'Personal' },
    { id: 5, title: 'Technical Integration', shortLabel: 'Technical' },
    { id: 6, title: 'Reflection & Future', shortLabel: 'Reflection' },
  ];

  // Fixed ESLint error: "@typescript-eslint/no-explicit-any" by removing `any` from the value param.
  // Replaced with a generic type-safe version: ensures `value` matches the type of the given `field` from FeedbackData.
  const updateFormData = <K extends keyof FeedbackData>(field: K, value: FeedbackData[K]) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      console.log(`Updated ${String(field)}:`, value); // Optional debug log
      return newFormData;
    });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.internshipDurationWeeks || !formData.internshipLocation || !formData.gender) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        const civicFields = [
          formData.civicResponsibility,
          formData.societalAwareness,
          formData.engineeringToSociety,
          formData.socialResponsibility,
          formData.ngoUnderstanding,
        ];
        if (civicFields.some((field) => field === null)) {
          toast.error('Please rate all statements');
          return false;
        }
        break;
      case 3:
        const problemFields = [
          formData.problemIdentification,
          formData.analyticalThinking,
          formData.toolApplication,
          formData.incompleteDataHandling,
          formData.collaborationSkills,
        ];
        if (problemFields.some((field) => field === null)) {
          toast.error('Please rate all statements');
          return false;
        }
        break;
      case 4:
        const personalFields = [
          formData.communicationSkills,
          formData.confidenceDiversity,
          formData.timeManagement,
          formData.careerInfluence,
          formData.initiativeConfidence,
        ];
        if (personalFields.some((field) => field === null)) {
          toast.error('Please rate all statements');
          return false;
        }
        break;
      case 5:
        if (!formData.academicHelpfulness) {
          toast.error('Please answer if your academic background helped');
          return false;
        }
        break;
      case 6:
        if (
          !formData.realWorldProblem ||
          !formData.problemSolution ||
          !formData.futureEngagement ||
          !formData.recommendInternship
        ) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error('User session not found. Please login again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback/submitfeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      toast.success('Feedback submitted successfully!');
      onComplete();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingScale = ({
    value,
    onChange,
    label,
    name,
  }: {
    value: number | null;
    onChange: (val: number | null) => void; // Allow null values
    label: string;
    name: string;
  }) => (
    <div className="mb-4">
      {/* Mobile view - stacked */}
      <div className="block md:hidden">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label
              key={rating}
              className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                value === rating
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-gray-300 hover:border-brand-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={rating}
                checked={value === rating}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="sr-only"
              />
              {rating}
            </label>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>

      {/* Desktop view - table row */}
      <div className="hidden md:flex items-center py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 pr-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        </div>
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={rating}
                checked={value === rating}
                onChange={() => onChange(rating)}
                className="sr-only"
              />
              <div
                className={`
      w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
      ${
        value === rating
          ? 'bg-brand-500 border-brand-500 text-white'
          : 'border-gray-300 hover:border-brand-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
      }
    `}
              >
                {rating}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration of Internship (weeks) *
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={formData.internshipDurationWeeks || ''}
                onChange={(e) => updateFormData('internshipDurationWeeks', parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                placeholder="Enter number of weeks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location of Internship *
              </label>
              <div className="space-y-2">
                {['Rural', 'Urban', 'Semi-Urban'].map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="radio"
                      name="location"
                      value={location}
                      checked={formData.internshipLocation === location}
                      onChange={(e) => updateFormData('internshipLocation', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
              <div className="space-y-2">
                {['Male', 'Female', 'Other'].map((genderOption) => (
                  <label key={genderOption} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={genderOption}
                      checked={formData.gender === genderOption}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{genderOption}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Civic Awareness and Social Understanding
            </h3>

            {/* Desktop Table Header */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 pr-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Statement</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Neutral</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Agree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Agree</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <RatingScale
                  value={formData.civicResponsibility}
                  onChange={(val) => updateFormData('civicResponsibility', val)}
                  label="I understand the importance of civic responsibility."
                  name="civicResponsibility"
                />

                <RatingScale
                  value={formData.societalAwareness}
                  onChange={(val) => updateFormData('societalAwareness', val)}
                  label="I became more aware of local societal problems through the internship."
                  name="societalAwareness"
                />

                <RatingScale
                  value={formData.engineeringToSociety}
                  onChange={(val) => updateFormData('engineeringToSociety', val)}
                  label="I can relate engineering skills to real-world societal challenges."
                  name="engineeringToSociety"
                />

                <RatingScale
                  value={formData.socialResponsibility}
                  onChange={(val) => updateFormData('socialResponsibility', val)}
                  label="I became more aware of my social responsibilities as an engineering student."
                  name="socialResponsibility"
                />

                <RatingScale
                  value={formData.ngoUnderstanding}
                  onChange={(val) => updateFormData('ngoUnderstanding', val)}
                  label="I understood how civic bodies or NGOs function in addressing societal needs."
                  name="ngoUnderstanding"
                />
              </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rate each statement on a scale of 1-5</p>

              <RatingScale
                value={formData.civicResponsibility}
                onChange={(val) => updateFormData('civicResponsibility', val)}
                label="I understand the importance of civic responsibility."
                name="civicResponsibility"
              />

              <RatingScale
                value={formData.societalAwareness}
                onChange={(val) => updateFormData('societalAwareness', val)}
                label="I became more aware of local societal problems through the internship."
                name="societalAwareness"
              />

              <RatingScale
                value={formData.engineeringToSociety}
                onChange={(val) => updateFormData('engineeringToSociety', val)}
                label="I can relate engineering skills to real-world societal challenges."
                name="engineeringToSociety"
              />

              <RatingScale
                value={formData.socialResponsibility}
                onChange={(val) => updateFormData('socialResponsibility', val)}
                label="I became more aware of my social responsibilities as an engineering student."
                name="socialResponsibility"
              />

              <RatingScale
                value={formData.ngoUnderstanding}
                onChange={(val) => updateFormData('ngoUnderstanding', val)}
                label="I understood how civic bodies or NGOs function in addressing societal needs."
                name="ngoUnderstanding"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Problem-Solving and Analytical Thinking
            </h3>

            {/* Desktop Table Header */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 pr-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Statement</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Neutral</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Agree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Agree</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <RatingScale
                  value={formData.problemIdentification}
                  onChange={(val) => updateFormData('problemIdentification', val)}
                  label="I identified a problem in the community and proposed a feasible solution."
                  name="problemIdentification"
                />

                <RatingScale
                  value={formData.analyticalThinking}
                  onChange={(val) => updateFormData('analyticalThinking', val)}
                  label="The internship improved my observation and analytical thinking skills."
                  name="analyticalThinking"
                />

                <RatingScale
                  value={formData.toolApplication}
                  onChange={(val) => updateFormData('toolApplication', val)}
                  label="I applied technical or computational tools during my internship."
                  name="toolApplication"
                />

                <RatingScale
                  value={formData.incompleteDataHandling}
                  onChange={(val) => updateFormData('incompleteDataHandling', val)}
                  label="I could work with incomplete or uncertain real-world data."
                  name="incompleteDataHandling"
                />

                <RatingScale
                  value={formData.collaborationSkills}
                  onChange={(val) => updateFormData('collaborationSkills', val)}
                  label="I collaborated effectively to solve problems."
                  name="collaborationSkills"
                />
              </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rate each statement on a scale of 1-5</p>

              <RatingScale
                value={formData.problemIdentification}
                onChange={(val) => updateFormData('problemIdentification', val)}
                label="I identified a problem in the community and proposed a feasible solution."
                name="problemIdentification"
              />

              <RatingScale
                value={formData.analyticalThinking}
                onChange={(val) => updateFormData('analyticalThinking', val)}
                label="The internship improved my observation and analytical thinking skills."
                name="analyticalThinking"
              />

              <RatingScale
                value={formData.toolApplication}
                onChange={(val) => updateFormData('toolApplication', val)}
                label="I applied technical or computational tools during my internship."
                name="toolApplication"
              />

              <RatingScale
                value={formData.incompleteDataHandling}
                onChange={(val) => updateFormData('incompleteDataHandling', val)}
                label="I could work with incomplete or uncertain real-world data."
                name="incompleteDataHandling"
              />

              <RatingScale
                value={formData.collaborationSkills}
                onChange={(val) => updateFormData('collaborationSkills', val)}
                label="I collaborated effectively to solve problems."
                name="collaborationSkills"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personal and Professional Development
            </h3>

            {/* Desktop Table Header */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 pr-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Statement</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Disagree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Neutral</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Agree</p>
                  </div>
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Strongly Agree</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <RatingScale
                  value={formData.communicationSkills}
                  onChange={(val) => updateFormData('communicationSkills', val)}
                  label="The internship helped me improve my communication skills."
                  name="communicationSkills"
                />

                <RatingScale
                  value={formData.confidenceDiversity}
                  onChange={(val) => updateFormData('confidenceDiversity', val)}
                  label="I gained confidence in interacting with diverse people."
                  name="confidenceDiversity"
                />

                <RatingScale
                  value={formData.timeManagement}
                  onChange={(val) => updateFormData('timeManagement', val)}
                  label="I developed better time and task management habits."
                  name="timeManagement"
                />

                <RatingScale
                  value={formData.careerInfluence}
                  onChange={(val) => updateFormData('careerInfluence', val)}
                  label="The internship influenced my future career interests."
                  name="careerInfluence"
                />

                <RatingScale
                  value={formData.initiativeConfidence}
                  onChange={(val) => updateFormData('initiativeConfidence', val)}
                  label="I am more confident in taking initiative and solving practical problems."
                  name="initiativeConfidence"
                />
              </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rate each statement on a scale of 1-5</p>

              <RatingScale
                value={formData.communicationSkills}
                onChange={(val) => updateFormData('communicationSkills', val)}
                label="The internship helped me improve my communication skills."
                name="communicationSkills"
              />

              <RatingScale
                value={formData.confidenceDiversity}
                onChange={(val) => updateFormData('confidenceDiversity', val)}
                label="I gained confidence in interacting with diverse people."
                name="confidenceDiversity"
              />

              <RatingScale
                value={formData.timeManagement}
                onChange={(val) => updateFormData('timeManagement', val)}
                label="I developed better time and task management habits."
                name="timeManagement"
              />

              <RatingScale
                value={formData.careerInfluence}
                onChange={(val) => updateFormData('careerInfluence', val)}
                label="The internship influenced my future career interests."
                name="careerInfluence"
              />

              <RatingScale
                value={formData.initiativeConfidence}
                onChange={(val) => updateFormData('initiativeConfidence', val)}
                label="I am more confident in taking initiative and solving practical problems."
                name="initiativeConfidence"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Technical Integration</h3>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Did you use any of the following during your internship? (Check all that apply)
              </p>
              <div className="space-y-2">
                {[
                  { key: 'usedDataForms', label: 'Data collection forms' },
                  { key: 'usedSpreadsheets', label: 'Spreadsheets for analysis' },
                  { key: 'usedMobileApps', label: 'Mobile apps (survey, maps, etc.)' },
                  { key: 'usedProgrammingTools', label: 'Programming tools (Python, MATLAB, etc.)' },
                  { key: 'usedIoTDevices', label: 'IoT / sensors / field devices' },
                  { key: 'noneOfAbove', label: 'None of the above' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[item.key as keyof FeedbackData] as boolean}
                      onChange={(e) => updateFormData(item.key as keyof FeedbackData, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.usedProgrammingTools && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Please specify the programming tools used:
                </label>
                <input
                  type="text"
                  value={formData.programmingToolsName}
                  onChange={(e) => updateFormData('programmingToolsName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                  placeholder="e.g., Python, MATLAB, R, etc."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Did your academic background help in understanding or solving any problem? *
              </label>
              <div className="space-y-2">
                {['Yes', 'No', 'Partially'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="academicHelp"
                      value={option}
                      checked={formData.academicHelpfulness === option}
                      onChange={(e) => updateFormData('academicHelpfulness', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {(formData.academicHelpfulness === 'Yes' || formData.academicHelpfulness === 'Partially') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Please briefly describe how:
                </label>
                <textarea
                  value={formData.academicHelpExplanation}
                  onChange={(e) => updateFormData('academicHelpExplanation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                  rows={3}
                  placeholder="Describe how your academic background helped..."
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Outcomes and Reflection</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe one real-world problem you observed during your internship *
              </label>
              <textarea
                value={formData.realWorldProblem}
                onChange={(e) => updateFormData('realWorldProblem', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                rows={4}
                placeholder="Describe the problem you observed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How did you attempt to solve or address this issue? *
              </label>
              <textarea
                value={formData.problemSolution}
                onChange={(e) => updateFormData('problemSolution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                rows={4}
                placeholder="Describe your approach to solving the problem..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Would you be interested in continuing to work on social or civic issues in the future? *
              </label>
              <div className="space-y-2">
                {['Yes', 'No', 'Maybe'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="futureEngagement"
                      value={option}
                      checked={formData.futureEngagement === option}
                      onChange={(e) => updateFormData('futureEngagement', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Would you recommend this internship to other students? *
              </label>
              <div className="space-y-2">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="recommendInternship"
                      value={option}
                      checked={formData.recommendInternship === option}
                      onChange={(e) => updateFormData('recommendInternship', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Why or why not?</label>
              <textarea
                value={formData.recommendationReason}
                onChange={(e) => updateFormData('recommendationReason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800"
                rows={3}
                placeholder="Explain your recommendation..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Checking submission status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Already submitted state
  if (hasSubmitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Feedback Already Submitted</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your feedback has been submitted successfully. Thank you for your participation!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You can only submit feedback once per internship.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="overflow-x-auto hide-scrollbar">
          <nav className="flex whitespace-nowrap min-w-full md:p-2 gap-1 md:gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  px-2 md:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 gap-2 cursor-default
                  ${
                    currentStep === step.id
                      ? 'bg-brand-500 text-white'
                      : index < currentStep - 1
                        ? 'bg-gray-100 text-brand-500 dark:bg-gray-800 dark:text-brand-400'
                        : 'bg-transparent text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-4 h-4 rounded-full flex items-center justify-center text-xs
                      ${
                        currentStep === step.id
                          ? 'bg-white text-brand-500'
                          : index < currentStep - 1
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  {step.shortLabel}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : currentStep === steps.length ? (
            'Submit Feedback'
          ) : (
            <>
              Next
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackForm;
