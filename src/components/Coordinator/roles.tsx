import React from 'react';

const rolesList = [
  'Facilitate the issuance of Letters of Recommendation (LOR) to students.',
  'Collect NGO details in accordance with standard format.',
  'Assign faculty mentors to students and provide them with relevant student and NGO information.',
  'Maintain regular communication with faculty mentors, offering support and guidance as necessary.',
  'Distribute evaluation guidelines to faculty mentors for assessing student (out of 50 marks).',
  'Allotment of examiners for poster evaluation and provide them with evaluation sheets (out of 50 marks).',
  'Organize the evaluation schedule, including arrangements for poster presentations.',
  'Collect soft copies of CSSI reports, posters, and certificates following approval from faculty mentors.',
  'Gather hard copies of the top 5 posters from each division for record-keeping purposes.',
  'Prepare the final marks sheet (out of 100 marks) and upload it to TCSion.',
  'Collect both hard copies and soft copies of evaluation reports signed by examiners.',
];

const FacultyRoles = () => {
  return (
    <section id="roles" className="py-5 md:py-7 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full">
            <h2 className="mb-8 text-3xl font-bold text-dark dark:text-white sm:text-4xl">
              Roles of Department Coordinator of CSSI
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
