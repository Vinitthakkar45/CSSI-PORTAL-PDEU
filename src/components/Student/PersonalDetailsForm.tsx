'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import Button from '@/components/Home/ui/button/Button';
import { useSession } from 'next-auth/react';
import { SelectStudent } from '@/drizzle/schema';
// import { toast } from 'sonner';

type UserDetails = {
  id: number;
  email: string;
  role: string;
  profileData: SelectStudent | null;
};

export default function PersonalDetailsForm({
  onComplete,
  userData,
}: {
  onComplete: () => void;
  userData: UserDetails | null;
}) {
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    department: '',
    division: '',
    groupNumber: '',
    contactNumber: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId || !userData) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const localStorageKey = `personalDetails_${userId}`;
      const storedData = localStorage.getItem(localStorageKey);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } else if (userData.profileData) {
        // Only use profile data if no localStorage data exists
        const profile = userData.profileData;
        const newFormData = {
          rollNumber: profile.rollNumber || '',
          name: profile.name || '',
          department: profile.department || '',
          division: profile.division || '',
          groupNumber: profile.groupNumber || '',
          contactNumber: profile.contactNumber || '',
        };

        setFormData(newFormData);
        localStorage.setItem(localStorageKey, JSON.stringify(newFormData));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Update localStorage as user types
      if (userId) {
        localStorage.setItem(`personalDetails_${userId}`, JSON.stringify(newData));
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const studentData = {
      rollNumber: formData.rollNumber,
      name: formData.name,
      department: formData.department,
      division: formData.division,
      groupNumber: formData.groupNumber,
      contactNumber: formData.contactNumber,
    };

    try {
      const response = await fetch('/api/student/update-personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          studentData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status: ${response.status}`);
      }

      await response.json();
      // toast.success("Personal details saved successfully");

      onComplete();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // toast.error("Failed to save personal details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Personal Details">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-pulse">Loading form data...</div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter your roll number"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleChange}
                placeholder="Enter your division"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="groupNumber"
                value={formData.groupNumber}
                onChange={handleChange}
                placeholder="Enter your group number"
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                required
              />
            </div>

            {error && <div className="col-span-full text-red-500 text-sm">{error}</div>}

            <div className="col-span-full">
              <Button className="w-full" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </ComponentCard>
  );
}
