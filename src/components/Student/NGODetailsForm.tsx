'use client';
import { useState } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import Button from '@/components/Home/ui/button/Button';
import { UserDetails, NGODetails, ProjectDetails } from '@/types/student';

type NGOFormProps = {
  onComplete: (formData: NGODetails & ProjectDetails) => Promise<Record<string, string> | null>;
  userData: UserDetails | null;
};

export default function NGODetailsForm({ onComplete, userData }: NGOFormProps) {
  const [formData, setFormData] = useState<NGODetails & ProjectDetails>({
    ngoName: userData?.profileData?.ngoName || '',
    ngoCity: userData?.profileData?.ngoCity || '',
    ngoDistrict: userData?.profileData?.ngoDistrict || '',
    ngoState: userData?.profileData?.ngoState || '',
    ngoCountry: userData?.profileData?.ngoCountry || '',
    ngoAddress: userData?.profileData?.ngoAddress || '',
    ngoNatureOfWork: userData?.profileData?.ngoNatureOfWork || '',
    ngoEmail: userData?.profileData?.ngoEmail || '',
    ngoPhone: userData?.profileData?.ngoPhone || '',
    problemDefinition: userData?.profileData?.problemDefinition || '',
    proposedSolution: userData?.profileData?.proposedSolution || '',
    ngoChosen: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <ComponentCard title="NGO Details">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div className="w-full">
            <Input
              type="text"
              name="ngoName"
              value={formData.ngoName}
              onChange={handleChange}
              placeholder="Enter NGO name"
              error={errors.ngoName}
              required
            />
            {errors.ngoName && <span className="text-red-500 text-sm">{errors.ngoName}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="ngoCity"
              value={formData.ngoCity}
              onChange={handleChange}
              placeholder="Enter NGO city"
              error={errors.ngoCity}
              required
            />
            {errors.ngoCity && <span className="text-red-500 text-sm">{errors.ngoCity}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="ngoDistrict"
              value={formData.ngoDistrict}
              onChange={handleChange}
              placeholder="Enter NGO district"
              error={errors.ngoDistrict}
              required
            />
            {errors.ngoDistrict && <span className="text-red-500 text-sm">{errors.ngoDistrict}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="ngoState"
              value={formData.ngoState}
              onChange={handleChange}
              placeholder="Enter NGO state"
              error={errors.ngoState}
              required
            />
            {errors.ngoState && <span className="text-red-500 text-sm">{errors.ngoState}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="ngoCountry"
              value={formData.ngoCountry}
              onChange={handleChange}
              placeholder="Enter NGO country"
              error={errors.ngoCountry}
              required
            />
            {errors.ngoCountry && <span className="text-red-500 text-sm">{errors.ngoCountry}</span>}
          </div>
          <div className="w-full">
            <Input
              type="text"
              name="ngoNatureOfWork"
              value={formData.ngoNatureOfWork}
              onChange={handleChange}
              placeholder="Describe NGO nature of work"
              error={errors.ngoNatureOfWork}
              required
            />
            {errors.ngoNatureOfWork && <span className="text-red-500 text-sm">{errors.ngoNatureOfWork}</span>}
          </div>
          <div className="w-full">
            <Input
              type="email"
              name="ngoEmail"
              value={formData.ngoEmail}
              onChange={handleChange}
              placeholder="Enter NGO email"
              error={errors.ngoEmail}
              required
            />
            {errors.ngoEmail && <span className="text-red-500 text-sm">{errors.ngoEmail}</span>}
          </div>
          <div className="w-full">
            <Input
              type="tel"
              name="ngoPhone"
              value={formData.ngoPhone}
              onChange={handleChange}
              placeholder="Enter NGO phone"
              error={errors.ngoPhone}
              required
            />
            {errors.ngoPhone && <span className="text-red-500 text-sm">{errors.ngoPhone}</span>}
          </div>
          <div className="w-full md:col-span-2">
            <Input
              type="text"
              name="ngoAddress"
              value={formData.ngoAddress}
              onChange={handleChange}
              placeholder="Enter NGO complete address"
              error={errors.ngoAddress}
              required
            />
            {errors.ngoAddress && <span className="text-red-500 text-sm">{errors.ngoAddress}</span>}
          </div>
          <div className="w-full md:col-span-2">
            <Input
              type="text"
              name="problemDefinition"
              value={formData.problemDefinition}
              onChange={handleChange}
              placeholder="Enter NGO problem definition"
              error={errors.problemDefinition}
              required
            />
            {errors.problemDefinition && <span className="text-red-500 text-sm">{errors.problemDefinition}</span>}
          </div>
          <div className="w-full md:col-span-2">
            <Input
              type="text"
              name="proposedSolution"
              value={formData.proposedSolution}
              onChange={handleChange}
              placeholder="Enter NGO proposed solution"
              error={errors.proposedSolution}
              required
            />
            {errors.proposedSolution && <span className="text-red-500 text-sm">{errors.proposedSolution}</span>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <Button className="w-full" size="nm" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
