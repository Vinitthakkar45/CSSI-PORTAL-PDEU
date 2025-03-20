import { Feature } from '@/types/feature';

const AboutStep = ({ step }: { step: Feature }) => {
  const { icon, title, paragraph } = step;
  return (
    <div className="w-full">
      <div className="wow fadeInUp flex items-start gap-4" data-wow-delay=".15s">
        {/* Main container with flex, items-start, and gap */}
        <div className="mb-10 flex h-[50px] w-[50px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-white">
          {icon}
        </div>
        <div className="ml-10">
          {/* Container for title and paragraph */}
          <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            {title}
          </h3>
          <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">{paragraph}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutStep;
