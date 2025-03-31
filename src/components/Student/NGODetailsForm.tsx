'use client';
import { useState } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import TextArea from '@/components/Home/form/input/TextArea';
import Button from '@/components/Home/ui/button/Button';

export default function BasicForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    ngoName: '',
    ngoLocation: '',
    ngoPhone: '',
    ngoDescription: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    console.log(formData);

    try {
      const response = await fetch('https://dummyapi.example.com/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      onComplete();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }

    onComplete();
  };

  return (
    <ComponentCard title="Internship Details">
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
    </ComponentCard>
  );
}
