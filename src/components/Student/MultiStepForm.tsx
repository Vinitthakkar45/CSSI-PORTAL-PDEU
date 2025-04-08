'use client';
import { useState, useEffect } from 'react';
import PersonalDetailsForm from '@/components/Student/PersonalDetailsForm';
import LORGenerator from '@/components/Student/LorGenerator';
import NGODetailsForm from '@/components/Student/NGODetailsForm';
import OfferLetter from '@/components/Student/OfferLetterUpload';
import { useSession } from 'next-auth/react';
import { SelectStudent } from '@/drizzle/schema';
import Button from '@/components/Home/ui/button/Button';

type UserDetails = {
  id: number;
  email: string;
  role: string;
  profileData: SelectStudent | null;
};

export default function MultiStepForm({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('left');
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

          const userData = await response.json();
          setUserData(userData);
          localStorage.setItem(localStorageKey, JSON.stringify(userData));
        } catch (err) {
          console.error('Error fetching user data:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setSlideDirection('left');
      setCurrentStep(currentStep + 1);
    } else {
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
      setSlideDirection(step >= currentStep ? 'left' : 'right');
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
          return <PersonalDetailsForm onComplete={handleNextStep} userData={userData} />;
        case 2:
          return <LORGenerator onComplete={handleNextStep} userId={userId as string} />;
        case 3:
          return <NGODetailsForm onComplete={handleNextStep} userData={userData} />;
        case 4:
          return <OfferLetter onComplete={handleNextStep} userId={userId as string} />;
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
                  ${currentStep === step.id ? 'bg-primary text-blue-600' : 'bg-secondary hover:bg-secondary/80'}`}
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
