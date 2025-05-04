import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
import Creators from '@/components/Landing/Creators/Creators';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creators',
  description: 'About the Team',
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
