import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
import Contact from '@/components/Landing/Contact';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Page | Free Next.js Template for Startup and SaaS',
  description: 'This is Contact Page for Startup Nextjs Template',
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact Page" description="Contact to admins for any queries." />

      <Contact />
    </>
  );
};

export default ContactPage;
