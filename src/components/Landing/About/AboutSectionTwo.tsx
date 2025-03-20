import Image from 'next/image';
import AboutSteps from '../AboutSteps';

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0" data-wow-delay=".15s">
              <Image
                src="/images/about/presentation.svg"
                alt="about-image"
                fill
                className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
              />
              <Image
                src="/images/about/presentation.svg"
                alt="about-image"
                fill
                className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[570px]">
              <div className="mb-9">
                <div className="mb-12 max-w-[570px] lg:mb-0" data-wow-delay=".15s">
                  <div className="mx-[-12px] flex flex-wrap">
                    <AboutSteps start={3} stop={5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
