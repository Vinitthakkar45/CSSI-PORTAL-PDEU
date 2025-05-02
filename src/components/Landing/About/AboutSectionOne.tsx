import Image from 'next/image';
import SectionTitle from '../Common/SectionTitle';
import AboutSteps from '../AboutSteps';

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text }: { text: string }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            {/* Content section */}
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="The Process: Internship and Evaluation"
                paragraph="Your CSSI internship will hone essential skills in community service, real-world communication, and collaborative teamwork. You'll also master report creation, presentation delivery, and gain a deep understanding of social work's significance. Now, let's walk through the steps to make the most of this experience."
                mb="44px"
              />
              <div className="w-full px-4 md:hidden">
                <div className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center" data-wow-delay=".15s">
                  <Image
                    src="/images/about/ngohelping.svg"
                    alt="about-image"
                    fill
                    className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none"
                  />
                  <Image
                    src="/images/about/ngohelping.svg"
                    alt="about-image"
                    fill
                    className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none"
                  />
                </div>
              </div>
              <div className="mb-12 max-w-[570px] lg:mb-0" data-wow-delay=".15s">
                <div className="mx-[-12px] flex flex-wrap">
                  <AboutSteps start={0} stop={3} />
                </div>
              </div>
            </div>

            {/* Images for desktop view */}
            <div className="w-full px-4 lg:w-1/2">
              {/* First image for desktop view only */}
              <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0 mb-20 hidden md:block">
                <Image
                  src="/images/about/ngohelping.svg"
                  alt="about-image"
                  fill
                  className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/about/ngohelping.svg"
                  alt="about-image"
                  fill
                  className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>

              {/* Second image always visible */}
              <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
                <Image
                  src="/images/about/certificate.svg"
                  alt="about-image"
                  fill
                  className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/about/certificate.svg"
                  alt="about-image"
                  fill
                  className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
