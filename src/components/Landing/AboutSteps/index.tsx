import AboutStep from './AboutStep';
import stepsData from './stepdata';

const AboutSteps = ({ start, stop }: { start: number; stop: number }) => {
  return (
    <section id="features" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-1 lg:grid-cols-1">
          {stepsData.slice(start, stop).map((step) => (
            <AboutStep key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSteps;
