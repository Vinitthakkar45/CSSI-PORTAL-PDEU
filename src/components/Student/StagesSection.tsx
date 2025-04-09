import React from 'react';
import StageCard from './StageCard';
// import NGODetailsForm from './NGODetailsForm';
import MultiStepForm from './MultiStepForm';
import StageProgress from './StageProgress';
import { stages } from './data/stages';
import { useStages } from './hooks/useStages';
import InternshipProgress from './InternshipProgress';
import ReportSubmission from './UploadDocs';
import MentorAssignment from './MentorAssignment';

const StagesSection: React.FC = () => {
  const {
    currentStage,
    maxStageUnlocked,
    activeForm,
    getStageStatus,
    handleStageClick,
    handleStageComplete,
    setActiveForm,
    isLoading,
  } = useStages();

  const renderActiveForm = () => {
    switch (activeForm) {
      case 1:
        return <MultiStepForm onComplete={() => handleStageComplete(1)} />;
      case 2:
        return <InternshipProgress onComplete={() => handleStageComplete(2)} />;
      case 3:
        return <ReportSubmission onComplete={() => handleStageComplete(3)} />;
      case 4:
        return <MentorAssignment onComplete={() => handleStageComplete(4)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container pb-4 mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse">Loading your internship progress...</div>
        </div>
      </div>
    );
  }

  const hasCompletedAvailableStages = currentStage > maxStageUnlocked;

  return (
    <div className="container pb-4 mx-auto">
      <StageProgress
        currentStage={hasCompletedAvailableStages ? maxStageUnlocked + 1 : currentStage}
        totalStages={stages.length}
        handleStageClick={handleStageClick}
        maxStageUnlocked={maxStageUnlocked}
      />

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

      {!activeForm && currentStage < 5 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white/90">
            {hasCompletedAvailableStages ? 'Waiting for Next Stage' : 'Continue Your Internship Journey'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {hasCompletedAvailableStages ? (
              <>You have completed all available stages. The next stage will be unlocked soon.</>
            ) : currentStage <= maxStageUnlocked ? (
              <>You are currently at stage {currentStage}. Click below to continue.</>
            ) : (
              <>You have completed stage {currentStage - 1}. The next stage will be available soon.</>
            )}
          </p>
          {currentStage <= maxStageUnlocked && !hasCompletedAvailableStages && (
            <button
              onClick={() => setActiveForm(currentStage)}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              {currentStage === 1 ? 'Start' : 'Continue to'} Stage {currentStage}
            </button>
          )}
        </div>
      )}

      {currentStage === 5 && (
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
