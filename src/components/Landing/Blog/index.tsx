import React from 'react';

const GuidelinesContent = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 bg-white dark:bg-gray-900 rounded-lg shadow-md text-justify">
      {/* Preface Section */}
      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Preface
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The Internship Handbook on the Civic & Social Service Internship (CSSI) is designed to provide students,
            faculty, parents, guardians and other interested people with an overview of the process and content of the
            internship offered by School of Technology (SOT), Pandit Deendayal Energy University (PDEU).
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Students are instructed to read and understand it thoroughly and follow the directions given. Students
            should retain if for future reference.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The handbook provides details about what the internship entails, its learning objectives, procedure, policy,
            undertaking, contact details of CSSI coordinators and other relevant information.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The internship course is really an independent learning experience. Through this internship, we hope to
            provide an experience that challenges and supplements the education our students are experiencing at SOT,
            PDEU.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Have an enjoyable journey
          </p>
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
              <span className="block text-lg font-bold mb-2 text-blue-600 dark:text-blue-400">Coordinators:</span>
              <span className="block font-semibold ml-2">Dr. Abhishek Kumar</span>
              <span className="block font-semibold ml-2">Dr. Himanshu Gajera</span>
            </p>
          </div>
        </div>
      </section>

      {/* Other sections with improved styling */}
      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Pandit Deendayal Energy University
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Pandit Deendayal Energy University (PDEU), formerly known as Pandit Deendayal Petroleum University was
            established in 2007 by the Gujarat State Legislature Act. PDEU started with a 52 acres campus in Gandhinagar
            and has expanded to around 100 acres of land. Pandit Deendayal Energy University addresses the need for
            trained and specialized human resource for Industry worldwide.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            It intends to expand the opportunities for students and professionals to develop intellectual knowledge base
            with leadership skills to compete in the global arena. This objective is being addressed through a number of
            specialized and well-planned undergraduate, postgraduate and doctoral energy education programmes and
            intensive research initiatives.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            A Research-led teaching university, PDEU intends to produce high quality managers, scientists, engineers,
            technologists, leaders, innovators, and entrepreneurs. Focus areas of the University are exploration to
            delivery of energy resources. It is also making inroads in the world of social sciences and humanities with
            the School of Liberal Studies.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The academic emphasis of the University is on the use of sound fundamentals in science and humanities,
            technology and management, as well as economic and environmental considerations, to address a variety of
            technological, economic, managerial and knowledge-based innovative issues, thereby comprehensively enhancing
            the quality of life.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Recognition
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The University has been established by the act of the Gujarat Legislature vide 04 April 2007. Moreover the
            programmes are well recognized by the industry in terms of relevant, quality and earnestness to cater to the
            futuristic needs. The University has NAAC accreditation with &apos;A++&apos; Grade & CGPA of 3.52 out of
            4.00
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          School of Technology
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The School of Technology (SOT) under Pandit Deendayal Energy University offers four years B.Tech & B.Sc.
            programmes in the following disciplines.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6 mb-4 text-body-color dark:text-gray-300 list-none">
            {[
              'Civil Engineering',
              'Mechanical Engineering',
              'Electronics & Communication Engineering',
              'Information and Communication Technology',
              'Computer Science and Engineering',
              'Computer Science and Business Systems',
              'BSc Data Science',
            ].map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            The School emphasizes on integrated development in teaching, research and overall grooming of the students.
            The School has established Science, Engineering and Technology Laboratories, workshops apart from state of
            the art academic, research recreational and residential facilities.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          What is Internship?
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Internship program is a pre-service training designed to render practical experience of a given job. In
            other words employing acquired knowledge hand in hand is called internship. Standard method taken for
            applying knowledge or information is meant &apos;internship&apos;. Formal knowledge increases eagerness to
            know anything and actual application enables an individual to realize the effectiveness and limitations.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            An effective internship provide interns with the opportunities to develop an understanding of the career
            area duties and responsibilities, terminology, climate, protocol, and other information that will enable
            interns to analyse and revise their meaningful future plans.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Internship program has become a significant aspect of graduate and postgraduate requirement. In practice, it
            is of great importance in changing the field of theoretical learning into practical experience.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Purpose of Internship
        </h2>
        <div className="space-y-4 pl-2">
          <ul className="list-disc pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            <li className="mb-2">To acclimatize students to the specific environment</li>
            <li className="mb-2">To sensitize students to the issue</li>
            <li className="mb-2">To convert students into skilled knowledge workers</li>
            <li className="mb-2">
              To find out the techniques and methods for the problems in the given environment of the workplace
            </li>
            <li className="mb-2">To understand the significance of proper management of time, data and potential</li>
          </ul>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Civic & Social Service Internship (CSSI)
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            As per the directive of the Ministry of Human Resource Development, Government of India, a Technical program
            should comprise of at least 20% courses on Humanities and Management. For better execution of policies
            during one&apos;s professional career, a technocrat is required to come to terms with the realities of life.
            The importance of civic and social responsibility is paramount to the success of democracy and promotion of
            dignified living. By engaging in civic responsibility, citizens ensure and uphold certain democratic values
            written in the Constitution. Those values or duties include justice, freedom, equality, diversity,
            authority, privacy, participation, truth, patriotism, human rights, rules of law, tolerance, mutual
            assistance, self-restraint and self-respect.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            SOT, have introduced Civic and Social Service Internship as a training requirement integral to all B. Tech.
            Programs for first year students. It is conceptualized as a platform for pre-planned, organized, structured,
            supervised off-campus experiences with an academic context.
          </p>
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Associating oneself in understanding issues of civic amenities, societal grievances and models of providing
            succor to needy and unprivileged, one comprehends meaning of life and living. By getting their hands dirty
            and actually doing work, students experience the value and impact of giving to people and learn to be
            productive members of society. It also provides an opportunity to the students to integrate technology for
            solution of the societal problems.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Importance
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Volunteering is a form of civic responsibility which involves giving of time or labor without the
            expectation of compensation in any form. Many people volunteer through NGOs in several ways. Volunteering
            allows students the opportunity to share their skills and talents as well as to learn new skills while
            helping those in need of assistance. Civic Education is a method to teach civic responsibility. It is a way
            to promote and enlighten responsible citizenry committed to democratic principles. Civic education is a
            means to actively engage people in the practice of democracy. Civic and Social Responsibility is comprised
            of actions and attitudes associated with democratic governance and social participation. Civic
            responsibility can include participation in government, volunteers and memberships of voluntary
            associations. Actions of civic responsibility can be displayed in advocacy for various causes, such as
            political, economic, civil, and environmental or quality of life issues. The students are trained to plan
            and execute an extensive range of social services, social welfare activities, and work in health and
            philanthropic organizations.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Objectives of CSSI
        </h2>
        <div className="space-y-4 pl-2">
          <ul className="space-y-3 pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            <li className="mb-2">
              To develop a holistic view of social work and social welfare in the community, with special emphasis on
              the role of different agencies like Govt. departments and NGOs in human services.
            </li>
            <li className="mb-2">
              To enlighten and sensitize students on various types of problems of the people and their diversified
              cultural background.
            </li>
            <li className="mb-2">
              To understand and make a commitment to return back to the society to improve life of people
            </li>
            <li className="mb-2">
              To develop a holistic view of social welfare in the community, with special emphasis on the role of
              technologies in solution to societal problems
            </li>
            <li className="mb-2">
              To develop a holistic view of social welfare in the community, with special emphasis on the role of
              technologies in solution to societal problems
            </li>
            <li className="mb-2">
              To develop an understanding of the opportunities in working with diverse populations.
            </li>
            <li className="mb-2">
              To develop the self –awareness necessary to assess one&apos;s own values, attitudes, feelings, strengths,
              limitations, and interests and performance.
            </li>
            <li className="mb-2">To inspire young technocrats to become change makers</li>
          </ul>
          <p className="p-4 mt-6 text-base italic font-medium leading-relaxed bg-yellow-50 dark:bg-gray-800/50 border-l-4 border-yellow-400 rounded-r-lg text-gray-800 dark:text-yellow-300">
            CSSI (Course Code: 20TP110) is a mandatory course of 1 credit to be cleared by all the students for
            progression to higher semesters as per the academic rules.
          </p>
        </div>
      </section>

      <section className="text-gray-700 dark:text-gray-300 mb-12">
        <h2 className="p-4 mb-6 bg-gray-100 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl xl:text-2xl rounded-r-lg shadow-sm">
          Expected learning outcome of CSSI
        </h2>
        <div className="space-y-4 pl-2">
          <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            Some expected learnings and engagements for B.Tech & B.Sc. students from the CSSI are shared below
          </p>
          <ul className="list-disc pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
            <li className="mb-2">
              Sensitized workforce of enlightened Engineers and Managers who are socially concerned and willing to
              positively contribute to the society.
            </li>
            <li className="mb-2">Increased awareness about rural and urban areas.</li>
            <li className="mb-2">
              Finding out the societal issues in existing systems and suggesting possible solution.
            </li>
            <li className="mb-2">Enhanced understanding of students about rural development and rural management.</li>
            <li className="mb-2">Sensitized students with socially responsible behaviour.</li>
            <li className="mb-2">Established desired work habits and attitudes with the of social responsibility.</li>
            <li className="mb-2">Role of different civic bodies in the service of citizens</li>
            <li className="mb-2">Integration of to address the societal problems.</li>
            <li className="mb-2">About the opportunities in working with diverse populations.</li>
            <li className="mb-2">
              To assess one&apos;s own values, attitudes feelings strengths, limitations, interests and performance.
            </li>
            <li className="mb-2">
              Analysis of experiential learning via internship and issues of modern- day citizenship and democracy.
            </li>
            <li className="mb-2">
              Enhance skills of students i.e. observation skill, analytical skill, decision making skill, communication
              skill
            </li>
            <li className="mb-2">
              Projection of School of Technology and PDEU as a socially responsible organization.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default GuidelinesContent;
