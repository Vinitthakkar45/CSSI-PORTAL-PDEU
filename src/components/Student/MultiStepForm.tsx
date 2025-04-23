'use client';
import { useState, useEffect } from 'react';
import PersonalDetailsForm from '@/components/Student/PersonalDetailsForm';
import LORGenerator from '@/components/Student/LorGenerator';
import NGODetailsForm from '@/components/Student/NGODetailsForm';
import OfferLetter from '@/components/Student/OfferLetterUpload';
import { useSession } from 'next-auth/react';
import Button from '@/components/Home/ui/button/Button';
import { toast } from '@/components/Home/ui/toast/Toast';
import { UserDetails, PersonalDetails, NGODetails, ProjectDetails, StudentUpdateData } from '@/types/student';

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
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'LOR Generation' },
    { id: 3, label: 'NGO Details' },
    { id: 4, label: 'Offer Letter' },
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
          <nav className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${currentStep === step.id ? 'text-blue-600' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {step.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="relative overflow-hidden">{renderCurrentStep()}</div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          <Button onClick={handleNextStep} disabled={currentStep === 4}>
            {currentStep < 4 ? 'Next' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
