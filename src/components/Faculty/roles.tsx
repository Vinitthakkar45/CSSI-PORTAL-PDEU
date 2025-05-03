import React from 'react';

const rolesList = [
  'Initiate communication with assigned students, providing an overview of the CSSI program and assisting them in identifying suitable NGOs if necessary.',
  'Oversee daily progress and tasks, ensuring students maintain a detailed work log and geotag photos for reporting purposes.',
  'Facilitate students in identifying community issues and formulating viable solutions.',
  'Conduct regular check-ins to monitor internship progress, offering support and guidance as needed.',
  'Provide direction to students regarding the preparation of reports and posters, adhering to specified formats.',
  'Review and offer constructive feedback on draft reports and posters, facilitating improvements prior to final presentations and evaluations.',
  'Evaluate the overall performance of the CSSI based on predefined criteria, contributing to the assigned marks out of 50.',
  'For any inquiries or concerns, communicate with department coordinators.',
  'Each task must be performed using this portal only: https://cssi.pdpu.ac.in:4434',
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
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <ul className="list-disc space-y-4 pl-6 text-lg text-body-color dark:text-body-color-dark">
                {rolesList.map((role, index) => (
                  <li key={index} className="pb-2">
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacultyRoles;
