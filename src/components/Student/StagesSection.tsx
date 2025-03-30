import StageCard from './StageCard';
import NGODetailsForm from './NGODetailsForm';
import StageProgress from './StageProgress';
import { stages } from './data/stages';
import { useStages } from './hooks/useStages';
import InternshipProgress from './InternshipProgress';
import ReportSubmission from './ReportSubmission';
import MentorAssignment from './MentorAssignment';

const StagesSection: React.FC = () => {
  const { currentStage, activeForm, getStageStatus, handleStageClick, handleStageComplete, setActiveForm } = useStages({
    stages,
  });

  const renderActiveForm = () => {
    switch (activeForm) {
      case 1:
        return <NGODetailsForm onComplete={handleStageComplete} />;
      case 2:
        return <InternshipProgress onComplete={handleStageComplete} />;
      case 3:
        return <ReportSubmission onComplete={handleStageComplete} />;
      case 4:
        return <MentorAssignment onComplete={handleStageComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="container pb-4 mx-auto">
      <StageProgress currentStage={currentStage} totalStages={stages.length} handleStageClick={handleStageClick} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stages.map((stage) => (
          <StageCard
            key={stage.number}
            number={stage.number}
            title={stage.title}
            description={stage.description}
            status={getStageStatus(stage.number)}
            onClick={() => handleStageClick(stage.number)}
          />
        ))}
      </div>

      {activeForm && <div className="mt-8">{renderActiveForm()}</div>}

      {!activeForm && currentStage <= stages.length && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white/90">
            Continue Your Internship Journey
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Click on the current stage card above to continue your internship process.
          </p>
          <button
            onClick={() => setActiveForm(currentStage)}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Continue to Stage {currentStage}
          </button>
        </div>
      )}

      {currentStage > stages.length && (
        <div className="bg-success-50 rounded-xl p-6 border border-success-200 text-center dark:bg-success-500/10 dark:border-success-500/30">
          <h3 className="text-xl font-semibold mb-2 text-success-700 dark:text-success-400">Congratulations!</h3>
          <p className="text-sm text-success-600 dark:text-success-300 mb-4">
            You have successfully completed all stages of your rural internship.
          </p>
        </div>
      )}
    </div>
  );
};

export default StagesSection;
