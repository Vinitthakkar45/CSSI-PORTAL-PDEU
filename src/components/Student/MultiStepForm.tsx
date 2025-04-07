'use client';
import { useState, useEffect } from 'react';
import PersonalDetailsForm from '@/components/Student/PersonalDetailsForm';
import { useSession } from 'next-auth/react';
import { SelectStudent } from '@/drizzle/schema';

type UserDetails = {
  id: number;
  email: string;
  role: string;
  profileData: SelectStudent | null;
};

export default function MultiStepForm({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user/getUserById?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          setUserData(userData);
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

  const handleStepComplete = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse">Loading...</div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <PersonalDetailsForm onComplete={onComplete} userData={userData} />;
      // onStepComplete={() => handleStepComplete(2)}

      // case 2:
      //   return <LORGenerator onComplete={() => handleStepComplete(3)} userData={userData} />;
      // case 3:
      //   return <NGODetailsForm onComplete={() => handleStepComplete(4)} userData={userData} />;
      // case 4:
      //   return <OfferLetterUpload onComplete={() => handleStepComplete(5)} userData={userData} />;
      default:
        return <div>Registration complete!</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${step < currentStep ? 'text-green-500' : step === currentStep ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step < currentStep
                    ? 'bg-green-100 text-green-500 border-2 border-green-500'
                    : step === currentStep
                      ? 'bg-blue-100 text-blue-500 border-2 border-blue-500'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-400'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              <span className="text-xs font-medium">
                {step === 1 && 'Personal Details'}
                {step === 2 && 'LOR Generation'}
                {step === 3 && 'NGO Details'}
                {step === 4 && 'Offer Letter'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  );
}
