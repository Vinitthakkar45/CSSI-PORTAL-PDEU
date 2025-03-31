'use client';
import React from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Form from '@/components/Home/form/Form';
import Input from '@/components/Home/form/input/InputField';
import TextArea from '@/components/Home/form/input/TextArea';
import Button from '@/components/Home/ui/button/Button';

export default function BasicForm({ onComplete }: { onComplete: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // toast.success("NGO details submitted successfully!");
    onComplete();
  };
  return (
    <ComponentCard title="Internship Details">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input type="text" placeholder="Your Name" />
          </div>
          <div>
            <Input type="text" placeholder="NGO Name" />
          </div>
          <div>
            <Input type="text" placeholder="NGO Location" />
          </div>
          <div>
            <Input type="mobile" placeholder="NGO Phone" />
          </div>
          <div className="col-span-full">
            <TextArea placeholder="NGO Description" />
          </div>
          <div className="col-span-full">
            <Button className="w-full" size="sm">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
