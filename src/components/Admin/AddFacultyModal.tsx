'use client';
import React, { useState } from 'react';
import { Modal } from '../Home/ui/modal';
import Button from '../Home/ui/button/Button';
import Label from '@/components/Home/form/Label';
import Input from '../Home/form/input/InputField';

type TableModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddFacultyModal({ isOpen, onClose }: TableModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
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

    if (!formData.name || !formData.email || !formData.department || !formData.role) {
      setError('All fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      console.log(formData);
      //   const res = await fetch('/api/admin/add-student', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData),
      //   });

      //   if (!res.ok) {
      //     throw new Error('Failed to add student.');
      //   }

      onClose();
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form className="overflow-y-auto max-h-[80vh] no-scrollbar" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Add New Student</h2>

        <div className="flex flex-col space-y-4">
          <div>
            <Label>Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Department</Label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="CSBS">CSBS</option>
              <option value="ECE">ECE</option>
              <option value="ICT">ICT</option>
              <option value="MECH">MECH</option>
              <option value="BSC-DS">BSC-DS</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Role</option>
              <option value="faculty">Faculty</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
