'use client';
import React, { useState } from 'react';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import Label from '@/components/Home/form/Label';
import Input from '../Home/form/input/InputField';
import { useSession } from 'next-auth/react';

type TableModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddFacultyModal({ isOpen, onClose }: TableModalProps) {
  const session = useSession();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    coordid: session.data?.user.id,
    role: session.data?.user.role,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lastname || !formData.firstname || !formData.email) {
      setError('All fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      console.log(formData);
      const res = await fetch('/api/addFaculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to add Faculty.');
      }

      onClose();
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form className="overflow-y-auto max-h-[80vh] no-scrollbar" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>

        <div className="flex flex-col space-y-4">
          <div>
            <Label>First name</Label>
            <Input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
