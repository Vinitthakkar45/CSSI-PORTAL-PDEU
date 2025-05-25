'use client';
import { useState } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import Button from '@/components/Home/ui/button/Button';
import Select from '@/components/Home/form/Select';
import { PersonalDetails, UserDetails } from '@/types/student';

interface PersonalDetailsFormProps {
  onComplete: (data: PersonalDetails) => Promise<Record<string, string> | null>;
  userData: UserDetails | null;
}

export default function PersonalDetailsForm({ onComplete, userData }: PersonalDetailsFormProps) {
  const [formData, setFormData] = useState<PersonalDetails>({
    rollNumber: userData?.profileData?.rollNumber || '',
    name: userData?.profileData?.name || '',
    department: userData?.profileData?.department || '',
    division: userData?.profileData?.division || '',
    groupNumber: userData?.profileData?.groupNumber || '',
    contactNumber: userData?.profileData?.contactNumber || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = [
    { value: 'BSC-DS', label: 'Bachelor of Science - Data Science (BSC-DS)' },
    { value: 'CSE', label: 'Computer Science and Engineering (CSE)' },
    { value: 'ICT', label: 'Information and Communication Technology (ICT)' },
    { value: 'MECH', label: 'Mechanical Engineering (MECH)' },
    { value: 'ECE', label: 'Electronics and Communication Engineering (ECE)' },
    { value: 'CIVIL', label: 'Civil Engineering (CIVIL)' },
    { value: 'CSBS', label: 'Computer Science and Business Systems (CSBS)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
    }));
    if (errors.department) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.department;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validationErrors = await onComplete(formData);

      if (validationErrors) {
        setErrors(validationErrors);

        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementsByName(firstErrorField)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Personal Details">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div className="w-full">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              error={errors.name}
              required
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
              error={errors.rollNumber}
              required
            />
            {errors.rollNumber && <span className="text-red-500 text-sm">{errors.rollNumber}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              placeholder="Enter division"
              error={errors.division}
              required
            />
            {errors.division && <span className="text-red-500 text-sm">{errors.division}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="groupNumber"
              value={formData.groupNumber}
              onChange={handleChange}
              placeholder="Enter group number"
              error={errors.groupNumber}
              required
            />
            {errors.groupNumber && <span className="text-red-500 text-sm">{errors.groupNumber}</span>}
          </div>
          <div className="w-full">
            <Select
              options={departmentOptions}
              placeholder="Select Department"
              onChange={handleDepartmentChange}
              defaultValue={formData.department}
              className={errors.department ? 'border-red-500' : ''}
            />
            {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>}
          </div>
          <div className="w-full">
            <Input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              error={errors.contactNumber}
              required
            />
            {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber}</span>}
          </div>

          <div className="col-span-full">
            <Button className="w-full" size="nm" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
