import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
import Creators from '@/components/Landing/Creators/Creators';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Page | Free Next.js Template for Startup and SaaS',
  description: 'This is Contact Page for Startup Nextjs Template',
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Meet Our Team" description="The creative minds behind this project" />

      <Creators />
    </>
  );
};

export default ContactPage;
