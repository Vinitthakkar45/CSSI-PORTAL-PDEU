import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
// import PdfViewer from '@/components/PdfViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Page | Free Next.js Template for Startup and SaaS',
  description: 'This is Blog Page for Startup Nextjs Template',
  // other metadata
};

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Guidelines"
        description="Following pdf contains the guidelines for the CSSI internship as provided by Pandit Deendayal Energy University (PDEU), 2025."
      />
      <section className="pb-[120px] pt-[90px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full ml-5 mt-7 mr-5 sm:mr-3 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Preface
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    The Internship Handbook on the Civic & Social Service Internship (CSSI) is designed to provide
                    students, faculty, parents, guardians and other interested people with an overview of the process
                    and content of the internship offered by School of Technology (SOT), Pandit Deendayal Energy
                    University (PDEU).
                    <br />
                    <br /> Students are instructed to read and understand it thoroughly and follow the directions given.
                    Students should retain if for future reference.
                    <br />
                    <br /> The handbook provides details about what the internship entails, its learning objectives,
                    procedure, policy, undertaking, contact details of CSSI coordinators and other relevant information.
                    <br />
                    <br /> The internship course is really an independent learning experience. Through this internship,
                    we hope to provide an experience that challenges and supplements the education our students are
                    experiencing at SOT, PDEU.
                    <br />
                    <br /> Have an enjoyable journey <br />
                    <br />
                    <b>Coordinators:</b> <br />
                    <span className="text-body-color dark:text-gray-300">
                      <b>Dr. Abhishek Kumar </b>
                    </span>
                    <br />
                    <span className="text-body-color dark:text-gray-300">
                      <b>Dr. Himanshu Gajera</b>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 mt-7 sm:mr-3 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Pandit Deendayal Energy University
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    Pandit Deendayal Energy University (PDEU), formerly known as Pandit Deendayal Petroleum University
                    was established in 2007 by the Gujarat State Legislature Act. PDEU started with a 52 acres campus in
                    Gandhinagar and has expanded to around 100 acres of land. Pandit Deendayal Energy University
                    addresses the need for trained and specialized human resource for Industry worldwide.
                    <br />
                    <br />
                    It intends to expand the opportunities for students and professionals to develop intellectual
                    knowledge base with leadership skills to compete in the global arena. This objective is being
                    addressed through a number of specialized and well-planned undergraduate, postgraduate and doctoral
                    energy education programmes and intensive research initiatives.
                    <br />
                    <br />
                    A Research-led teaching university, PDEU intends to produce high quality managers, scientists,
                    engineers, technologists, leaders, innovators, and entrepreneurs. Focus areas of the University are
                    exploration to delivery of energy resources. It is also making inroads in the world of social
                    sciences and humanities with the School of Liberal Studies.
                    <br />
                    <br />
                    The academic emphasis of the University is on the use of sound fundamentals in science and
                    humanities, technology and management, as well as economic and environmental considerations, to
                    address a variety of technological, economic, managerial and knowledge-based innovative issues,
                    thereby comprehensively enhancing the quality of life. <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Recognition
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    The University has been established by the act of the Gujarat Legislature vide 04 April 2007.
                    Moreover the programmes are well recognized by the industry in terms of relevant, quality and
                    earnestness to cater to the futuristic needs. The University has NAAC accreditation with
                    &apos;A++&apos; Grade & CGPA of 3.52 out of 4.00 <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    School of Technology
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    The School of Technology (SOT) under Pandit Deendayal Energy University offers four years B.Tech &
                    B.Sc. programmes in the following disciplines.
                    <br />
                    <span className="text-body-color dark:text-gray-300">
                      1. Civil Engineering
                      <br />
                      2. Mechanical Engineering
                      <br />
                      3. Electronics & Communication Engineering
                      <br />
                      4. Information and Communication Technology
                      <br />
                      5. Computer Science and Engineering
                      <br />
                      6. Computer Science and Business Systems
                      <br />
                      7. BSc Data Science
                      <br />
                    </span>
                    <br />
                    The School emphasizes on integrated development in teaching, research and overall grooming of the
                    students. The School has established Science, Engineering and Technology Laboratories, workshops
                    apart from state of the art academic, research recreational and residential facilities. <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    What is Internship?
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    Internship program is a pre-service training designed to render practical experience of a given job.
                    In other words employing acquired knowledge hand in hand is called internship. <br />
                    Standard method taken for applying knowledge or information is meant ‘internship’. Formal knowledge
                    increases eagerness to know anything and actual application enables an individual to realize the
                    effectiveness and limitations.
                    <br />
                    <br />
                    An effective internship provide interns with the opportunities to develop an understanding of the
                    career area duties and responsibilities, terminology, climate, protocol, and other information that
                    will enable interns to analyse and revise their meaningful future plans.
                    <br />
                    <br />
                    Internship program has become a significant aspect of graduate and postgraduate requirement. In
                    practice, it is of great importance in changing the field of theoretical learning into practical
                    experience. <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Purpose of Internship
                  </h3>
                  <ul className="list-disc pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
                    {' '}
                    {/* Improved list styling */}
                    <li className="mb-2">To acclimatize students to the specific environment</li>{' '}
                    {/* Added mb-2 for item spacing */}
                    <li className="mb-2">To sensitize students to the issue</li>
                    <li className="mb-2">To convert students into skilled knowledge workers</li>
                    <li className="mb-2">
                      To find out the techniques and methods for the problems in the given environment of the workplace
                    </li>
                    <li className="mb-2">
                      To understand the significance of proper management of time, data and potential
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Civic & Social Service Internship (CSSI)
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    As per the directive of the Ministry of Human Resource Development, Government of India, a Technical
                    program should comprise of at least 20% courses on Humanities and Management. For better execution
                    of policies during one’s professional career, a technocrat is required to come to terms with the
                    realities of life. The importance of civic and social responsibility is paramount to the success of
                    democracy and promotion of dignified living. By engaging in civic responsibility, citizens ensure
                    and uphold certain democratic values written in the Constitution. Those values or duties include
                    justice, freedom, equality, diversity, authority, privacy, participation, truth, patriotism, human
                    rights, rules of law, tolerance, mutual assistance, self-restraint and self-respect. <br />
                    <br />
                    SOT, have introduced Civic and Social Service Internship as a training requirement integral to all
                    B. Tech. Programs for first year students. It is conceptualized as a platform for pre-planned,
                    organized, structured, supervised off-campus experiences with an academic context. <br />
                    Associating oneself in understanding issues of civic amenities, societal grievances and models of
                    providing succor to needy and unprivileged, one comprehends meaning of life and living. By getting
                    their hands dirty and actually doing work, students experience the value and impact of giving to
                    people and learn to be productive members of society. It also provides an opportunity to the
                    students to integrate technology for solution of the societal problems. <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Importance
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                    Volunteering is a form of civic responsibility which involves giving of time or labor without the
                    expectation of compensation in any form. Many people volunteer through NGOs in several ways.
                    Volunteering allows students the opportunity to share their skills and talents as well as to learn
                    new skills while helping those in need of assistance. Civic Education is a method to teach civic
                    responsibility. It is a way to promote and enlighten responsible citizenry committed to democratic
                    principles. Civic education is a means to actively engage people in the practice of democracy. Civic
                    and Social Responsibility is comprised of actions and attitudes associated with democratic
                    governance and social participation. Civic responsibility can include participation in government,
                    volunteers and memberships of voluntary associations. Actions of civic responsibility can be
                    displayed in advocacy for various causes, such as political, economic, civil, and environmental or
                    quality of life issues. The students are trained to plan and execute an extensive range of social
                    services, social welfare activities, and work in health and philanthropic organizations. <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Objectives of CSSI
                  </h3>
                  <ul className="list-disc pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
                    {' '}
                    {/* Improved list styling */}
                    <li className="mb-2">
                      To develop a holistic view of social work and social welfare in the community, with special
                      emphasis on the role of different agencies like Govt. departments and NGOs in human services.
                    </li>{' '}
                    {/* Added mb-2 for item spacing */}
                    <li className="mb-2">
                      To enlighten and sensitize students on various types of problems of the people and their
                      diversified cultural background.
                    </li>
                    <li className="mb-2">
                      To understand and make a commitment to return back to the society to improve life of people
                    </li>
                    <li className="mb-2">
                      To develop a holistic view of social welfare in the community, with special emphasis on the role
                      of technologies in solution to societal problems
                    </li>
                    <li className="mb-2">
                      To develop a holistic view of social welfare in the community, with special emphasis on the role
                      of technologies in solution to societal problems
                    </li>
                    <li className="mb-2">
                      To develop an understanding of the opportunities in working with diverse populations.
                    </li>
                    <li className="mb-2">
                      To develop the self –awareness necessary to assess one’s own values, attitudes, feelings,
                      strengths, limitations, and interests and performance.
                    </li>
                    <li className="mb-2">To inspire young technocrats to become change makers</li>
                  </ul>
                  <i className="text-body-color dark:text-gray-300 font-medium leading-relaxed text-body-color">
                    **CSSI (Course Code: 20TP110) is a mandatory course of 1 credit to be cleared by all the students
                    for progression to higher semesters as per the academic rules.
                  </i>
                </div>
              </div>
            </div>
            <div className="w-full ml-5 mr-5 sm:mr-3 mt-7 lg:mr-5 xl:mr-7">
              <div className="wow fadeInUp" data-wow-delay=".15s">
                <div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Expected learning outcome of CSSI{' '}
                  </h3>
                  <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color mb-4">
                    {' '}
                    {/* Added mb-4 for spacing */}
                    Some expected learnings and engagements for B.Tech & B.Sc. students from the CSSI are shared below
                  </p>
                  <ul className="list-disc pl-6 text-base font-medium leading-relaxed text-body-color dark:text-gray-300">
                    <li className="mb-2">
                      Sensitized workforce of enlightened Engineers and Managers who are socially concerned and willing
                      to positively contribute to the society.
                    </li>
                    <li className="mb-2">Increased awareness about rural and urban areas.</li>
                    <li className="mb-2">
                      Finding out the societal issues in existing systems and suggesting possible solution.
                    </li>
                    <li className="mb-2">
                      Enhanced understanding of students about rural development and rural management.
                    </li>
                    <li className="mb-2">Sensitized students with socially responsible behaviour.</li>
                    <li className="mb-2">
                      Established desired work habits and attitudes with the of social responsibility.
                    </li>
                    <li className="mb-2">Role of different civic bodies in the service of citizens</li>
                    <li className="mb-2">Integration of to address the societal problems.</li>
                    <li className="mb-2">About the opportunities in working with diverse populations.</li>
                    <li className="mb-2">
                      To assess one&apos;s own values, attitudes feelings strengths, limitations, interests and
                      performance.
                    </li>
                    <li className="mb-2">
                      Analysis of experiential learning via internship and issues of modern- day citizenship and
                      democracy.
                    </li>
                    <li className="mb-2">
                      Enhance skills of students i.e. observation skill, analytical skill, decision making skill,
                      communication skill
                    </li>
                    <li className="mb-2">
                      Projection of School of Technology and PDEU as a socially responsible organization.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* {blogData.map((blog) => (
              <div key={blog.id} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>

          <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Prev
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    1
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    2
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    3
                  </a>
                </li>
                <li className="mx-1">
                  <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                    ...
                  </span>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    12
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div> */}
            {/* <PdfViewer fileUrl="/pdfs/2017_Simmermacher_AM.pdf" height={800} width={1000} /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
