// app/faculty/roles/page.tsx
import React from 'react';
import FacultyRoles from '@/components/Faculty/roles'; // Adjust import path based on your project structure

export const metadata = {
  title: 'Faculty Coordinator Roles | CSSI',
  description: 'Learn about the roles and responsibilities of faculty coordinators in the CSSI program.',
};

export default function FacultyRolesPage() {
  return (
    <>
      <FacultyRoles />
    </>
  );
}
