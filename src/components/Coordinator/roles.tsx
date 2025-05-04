import React from 'react';
import { CheckCircle } from 'lucide-react';

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

const CoordinatorRoles = () => {
  return (
    <section id="roles" className="py-5 md:py-7 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full">
            <h2 className="mb-8 text-3xl font-bold text-dark dark:text-white sm:text-4xl">
              Roles of Department Coordinator of CSSI
            </h2>
            <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Department Coordinators play a crucial role in ensuring the smooth operation of the CSSI program, serving
              as the bridge between students, faculty mentors, and the institution.
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

export default CoordinatorRoles;
