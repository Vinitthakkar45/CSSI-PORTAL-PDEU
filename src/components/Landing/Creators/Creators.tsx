import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export default function TeamMembers() {
  const teamMembers = [
    {
      name: 'Vinit Thakkar',
      linkedIn: 'https://www.linkedin.com/in/vinitthakkar45/',
      imageUrl: '/images/profiles/vinit.jpg',
    },
    {
      name: 'Kaushik Jain',
      linkedIn: 'https://www.linkedin.com/in/kaushikjaincodes/',
      imageUrl: '/images/profiles/kaushik.jpg',
    },
    {
      name: 'Krish Moorjani',
      linkedIn: 'https://www.linkedin.com/in/krish-moorjani-592020266',
      imageUrl: '/images/profiles/Krish.jpg',
    },
    {
      name: 'Saad Khan',
      linkedIn: 'https://www.linkedin.com/in/saad-khan-a6164030a/',
      imageUrl: '/images/profiles/Saad.jpg',
    },
  ];

  const guidanceOf = [
    {
      name: 'Dr Himanshu Gajera',
      role: 'Assistant Professor',
      linkedIn: 'https://www.linkedin.com/in/himanshu-gajera?originalSubdomain=in',
      imageUrl: '/images/profiles/Himanshu_gajera.jpg',
    },
    {
      name: 'Dr. Dhaval Pujara',
      role: 'Director SOT',
      linkedIn: 'https://www.linkedin.com/in/dhaval-pujara-3a6889100?originalSubdomain=in',
      imageUrl: '/images/profiles/dhaval.pujara_photo.jpg',
    },
    {
      name: 'Dr Abhishek Kumar',
      role: 'Associate Professor',
      linkedIn: 'https://orsp.pdpu.ac.in/adminfacviewprofile.aspx?facid=abhishek.k',
      imageUrl: '/images/profiles/abhishek.k_photo.jpg',
    },
  ];

  return (
    <div className="min-h-screen w-full dark:bg-gray-900 bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-xl font-bold dark:text-white">Designed & Developed By</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <Image src={member.imageUrl} alt={`Photo of ${member.name}`} fill className="object-cover" priority />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">{member.name}</h3>
              <a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Linkedin size={18} className="mr-1" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 mb-16">
          <h1 className="text-xl font-bold dark:text-white">Under the Supervision of</h1>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 ">
            {guidanceOf.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                  <Image src={member.imageUrl} alt={`Photo of ${member.name}`} fill className="object-cover" priority />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">{member.role}</p>
                <a
                  href={member.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Linkedin size={18} className="mr-1" />
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
