import Breadcrumb from '@/components/Landing/Common/Breadcrumb';
import GuidelinesContent from '@/components/Landing/Blog/index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSSI Guidelines | Pandit Deendayal Energy University',
  description: 'Guidelines for the CSSI internship as provided by Pandit Deendayal Energy University (PDEU), 2025.',
};

const GuidelinesPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Guidelines"
        description="Following content contains the guidelines for the CSSI internship as provided by Pandit Deendayal Energy University (PDEU), 2025."
      />
      <section className="pb-[120px] pt-[90px]">
        <div className="container">
          <GuidelinesContent />
        </div>
      </section>
    </>
  );
};

export default GuidelinesPage;
