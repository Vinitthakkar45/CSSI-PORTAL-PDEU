import AboutSectionOne from '@/components/Landing/About/AboutSectionOne';
import AboutSectionTwo from '@/components/Landing/About/AboutSectionTwo';
import Breadcrumb from '@/components/Landing/Common/Breadcrumb';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Page | Free Next.js Template for Startup and SaaS',
  description: 'This is About Page for Startup Nextjs Template',
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About CSSI Internships"
        description="Learn more about the CSSI Internship Portal and its insternship process here."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
