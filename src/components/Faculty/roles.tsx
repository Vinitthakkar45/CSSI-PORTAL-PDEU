import React from 'react';
import { CheckCircle } from 'lucide-react';

const rolesList = [
  'Initiate communication with assigned students, providing an overview of the CSSI program and assisting them in identifying suitable NGOs if necessary.',
  'Oversee daily progress and tasks, ensuring students maintain a detailed work log and geotag photos for reporting purposes.',
  'Facilitate students in identifying community issues and formulating viable solutions.',
  'Conduct regular check-ins to monitor internship progress, offering support and guidance as needed.',
  'Provide direction to students regarding the preparation of reports and posters, adhering to specified formats.',
  'Review and offer constructive feedback on draft reports and posters, facilitating improvements prior to final presentations and evaluations.',
  'Evaluate the overall performance of the CSSI based on predefined criteria, contributing to the assigned marks out of 50.',
  'For any inquiries or concerns, communicate with department coordinators.',
  'Each task must be performed using this portal only: https://cssi.pdpu.ac.in',
];

const FacultyRoles = () => {
  return (
    <section id="roles" className="py-5 md:py-7 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full">
            <h2 className="mb-8 text-3xl font-bold text-dark dark:text-white sm:text-4xl">
              Roles of Faculty Supervisor for CSSI
            </h2>
            <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Faculty supervisors are essential mentors who guide students throughout their CSSI journey, providing
              academic support and ensuring the quality of community service initiatives.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rolesList.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <CheckCircle className="h-6 w-6 text-brand-500 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacultyRoles;
