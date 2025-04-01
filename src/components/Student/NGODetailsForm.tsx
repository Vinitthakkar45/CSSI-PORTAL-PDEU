'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import TextArea from '@/components/Home/form/input/TextArea';
import Button from '@/components/Home/ui/button/Button';
import { useSession } from 'next-auth/react';

export default function BasicForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    ngoName: '',
    ngoLocation: '',
    ngoPhone: '',
    ngoDescription: '',
    ngoChosen: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const localStorageKey = `ngoDetails_${userId}`;
          const storedData = localStorage.getItem(localStorageKey);

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
            console.log('Data loaded from localStorage');
            setIsLoading(false);
            return;
          }

          const response = await fetch(`/api/user/getUserById?userId=${userId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();

          if (userData && userData.profileData && userData.role === 'student') {
            const profile = userData.profileData;

            const newFormData = {
              name: profile.name || '',
              ngoName: profile.ngoName || '',
              ngoLocation: profile.ngoLocation || '',
              ngoPhone: profile.ngoPhone || '',
              ngoDescription: profile.ngoDescription || '',
              ngoChosen: profile.ngoChosen || false,
            };

            setFormData(newFormData);

            localStorage.setItem(localStorageKey, JSON.stringify(newFormData));
            console.log('Data fetched from API and saved to localStorage');
          }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      if (userId) {
        localStorage.setItem(`ngoDetails_${userId}`, JSON.stringify(newData));
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const studentData = {
      name: formData.name,
      ngoName: formData.ngoName,
      ngoLocation: formData.ngoLocation,
      ngoPhone: formData.ngoPhone,
      ngoDescription: formData.ngoDescription,
      ngoChosen: true,
      stage: 1,
    };

    console.log('Submitting data:', studentData);

    try {
      const response = await fetch('/api/student/update-ngo', {
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

      const data = await response.json();
      console.log('Submission successful:', data);

      if (userId) {
        localStorage.setItem(`ngoDetails_${userId}`, JSON.stringify(formData));
      }

      onComplete();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Internship Details">
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="ngoName"
                value={formData.ngoName}
                onChange={handleChange}
                placeholder="NGO Name"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="ngoLocation"
                value={formData.ngoLocation}
                onChange={handleChange}
                placeholder="NGO Location"
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                name="ngoPhone"
                value={formData.ngoPhone}
                onChange={handleChange}
                placeholder="NGO Phone"
                required
              />
            </div>
            <div className="col-span-full">
              <TextArea
                name="ngoDescription"
                value={formData.ngoDescription}
                onChange={handleChange}
                placeholder="NGO Description"
                required
              />
            </div>

            {error && <div className="col-span-full text-red-500 text-sm">{error}</div>}

            <div className="col-span-full">
              <Button className="w-full" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </ComponentCard>
  );
}
