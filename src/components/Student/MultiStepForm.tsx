'use client';
import { useState, useEffect } from 'react';
import PersonalDetailsForm from '@/components/Student/PersonalDetailsForm';
import LORGenerator from '@/components/Student/LorGenerator';
import NGODetailsForm from '@/components/Student/NGODetailsForm';
import OfferLetter from '@/components/Student/OfferLetterUpload';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/Home/ui/toast/Toast';
import { UserDetails, PersonalDetails, NGODetails, ProjectDetails, StudentUpdateData } from '@/types/student';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MultiStepForm({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('left');
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const filterSensitiveData = (data: Record<string, unknown>) => {
    const allowedFields = [
      // Personal Details
      'rollNumber',
      'name',
      'department',
      'division',
      'groupNumber',
      'contactNumber',
      'profileImage',
      // NGO Details
      'ngoName',
      'ngoCity',
      'ngoDistrict',
      'ngoState',
      'ngoCountry',
      'ngoAddress',
      'ngoNatureOfWork',
      'ngoEmail',
      'ngoPhone',
      'ngoChosen',
      // Project Details
      'problemDefinition',
      'proposedSolution',
      // Document Details
      'offerLetter',
      'report',
      'certificate',
      'poster',
      'weekOnePhoto',
      'weekTwoPhoto',
      // Progress
      'stage',
    ] as const;

    return Object.keys(data)
      .filter((key) => allowedFields.includes(key as (typeof allowedFields)[number]))
      .reduce(
        (obj, key) => {
          obj[key] = data[key];
          return obj;
        },
        {} as Record<string, unknown>
      );
  };

  const updateStudentData = async (data: StudentUpdateData) => {
    if (!userId) {
      toast.error('User ID not found. Please try logging in again.');
      return { success: false, errors: null };
    }

    try {
      const response = await fetch('/api/student', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          data,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          const formattedErrors = responseData.errors;

          toast.error('Invalid values in fields!');
          return { success: false, errors: formattedErrors };
        }
        throw new Error(responseData.message || 'Failed to update data');
      }

      if (userId && userData) {
        // Filter sensitive data before storing
        const filteredData = filterSensitiveData(responseData.data);

        const updatedUserData = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          profileData: {
            ...userData.profileData,
            ...filteredData,
          },
        };

        setUserData(updatedUserData);
        localStorage.setItem(`userData_${userId}`, JSON.stringify(updatedUserData));
      }

      return { success: true, errors: null };
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred while updating data');
      return { success: false, errors: null };
    }
  };

  const handlePersonalDetailsComplete = async (formData: PersonalDetails) => {
    const { success, errors } = await updateStudentData(formData);
    if (success) {
      toast.success('Personal details saved successfully');
      handleNextStep();
    }
    return errors;
  };

  const handleNGODetailsComplete = async (formData: NGODetails & ProjectDetails) => {
    const { success, errors } = await updateStudentData(formData);
    if (success) {
      toast.success('NGO details saved successfully');
      handleNextStep();
    }
    return errors;
  };

  const handleLORComplete = () => {
    toast.success('LOR generated successfully');
    handleNextStep();
  };

  const handleOfferLetterComplete = () => {
    toast.success('Offer letter uploaded successfully');
    handleNextStep();
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const localStorageKey = `userData_${userId}`;
          const storedData = localStorage.getItem(localStorageKey);

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);
            setIsLoading(false);
            return;
          }

          const response = await fetch(`/api/user/getUserById?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const fetchedUserData = await response.json();
          // Filter sensitive data before storing
          const filteredData = {
            id: fetchedUserData.id,
            email: fetchedUserData.email,
            role: fetchedUserData.role,
            profileData: filterSensitiveData(fetchedUserData.profileData || {}),
          };

          setUserData(filteredData);
          localStorage.setItem(localStorageKey, JSON.stringify(filteredData));
        } catch (err) {
          console.error('Error fetching user data:', err);
          toast.error('Failed to load user data. Please refresh the page.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
      toast.warning('No user ID found. Please ensure you are logged in.');
    }
  }, [userId]);

  const validateStepAccess = (nextStep: number) => {
    if ((nextStep > 1 && !userData?.profileData?.name) || (nextStep === 4 && !userData?.profileData?.ngoChosen)) {
      toast.warning('Please complete the current step first');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      if (!validateStepAccess(nextStep)) return;

      setSlideDirection('left');
      setCurrentStep(nextStep);
    } else {
      toast.success('Registration process completed!');
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setSlideDirection('right');
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4 && step !== currentStep) {
      if (!validateStepAccess(step)) return;

      setSlideDirection(step > currentStep ? 'left' : 'right');
      setCurrentStep(step);
    }
  };

  const steps = [
    { id: 1, shortLabel: 'Info' },
    { id: 2, shortLabel: 'LOR' },
    { id: 3, shortLabel: 'NGO' },
    { id: 4, shortLabel: 'Offer' },
  ];

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse spinner"></div>
        </div>
      );
    }

    const CurrentStepComponent = () => {
      switch (currentStep) {
        case 1:
          return <PersonalDetailsForm onComplete={handlePersonalDetailsComplete} userData={userData} />;
        case 2:
          return <LORGenerator onComplete={handleLORComplete} userId={userId as string} />;
        case 3:
          return <NGODetailsForm onComplete={handleNGODetailsComplete} userData={userData} />;
        case 4:
          return <OfferLetter onComplete={handleOfferLetterComplete} userId={userId as string} />;
        default:
          return <div>Registration complete!</div>;
      }
    };

    return (
      <div className="relative w-full">
        <div
          key={currentStep}
          className={`w-full transform ${slideDirection === 'left' ? 'slide-left' : 'slide-right'}`}
        >
          <CurrentStepComponent />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-900 overflow-hidden">
      <div className="flex justify-between items-center m-3">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          onClick={handleNextStep}
          disabled={currentStep === 4}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="relative mb-6">
        <div className="overflow-x-auto hide-scrollbar">
          <nav className="flex whitespace-nowrap min-w-full p-2 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`
                    relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 gap-2
                    ${
                      currentStep === step.id
                        ? 'bg-brand-500 text-white'
                        : index < currentStep
                          ? 'bg-gray-100 text-brand-500 dark:bg-gray-800 dark:text-brand-400'
                          : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }
                    ${index === 0 ? 'ml-0' : ''}
                  `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${
                        currentStep === step.id
                          ? 'bg-white text-brand-500'
                          : index < currentStep
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  {step.shortLabel}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute left-0 -bottom-2 w-full">
          <div className="absolute h-[2px] w-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-brand-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">{renderCurrentStep()}</div>
    </div>
  );
}
