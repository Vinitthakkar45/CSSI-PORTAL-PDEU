import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
import Contact from '@/components/Landing/Contact';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | CSSI',
  description: 'This is Contact Page for the CSSI Internship Portal',
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
