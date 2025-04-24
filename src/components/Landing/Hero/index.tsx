import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image using Next.js Image Component */}
      <Image
        src="/images/hero/PDEU.jpeg"
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        priority
        className="z-0"
      />

      <div className="absolute inset-0 bg-[#FAFAFA] dark:bg-gray-900 opacity-30 dark:opacity-70"></div>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] text-dark-blue"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[1000px] text-center">
                <h1 className="mb-10 text-3xl font-extrabold leading-tight text-[#101238] dark:text-white sm:text-4xl sm:leading-tight md:text-6xl md:leading-tight">
                  LEARN, GROW, SERVE: <br />
                  THE CSSI INTERNSHIP PORTAL
                </h1>
                <p className="mb-12 font-semibold text-base leading-relaxed text-[#101238] dark:text-body-color-dark sm:text-lg md:text-xl">
                  A portal to simplify and streamline the internship journey, making it easier for students and faculty
                  to manage the process, striving towards a more efficient and productive experience.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/about"
                    className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                  >
                    Read More
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-block rounded-xs bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
