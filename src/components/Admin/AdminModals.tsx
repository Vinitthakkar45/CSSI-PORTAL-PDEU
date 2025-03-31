import { Modal } from '../Home/ui/modal';

export function InfoModal({
  isOpen,
  onClose,
  onCloseCross,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCloseCross} className="max-w-[600px] p-5 lg:p-10">
      <div className="text-center">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Information Alert!</h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          You are about to update the Students about the next stage unlock Via email, proceed cautiously
        </p>
        <div className="flex items-center justify-center w-full gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-light-500 shadow-theme-xs hover:bg-blue-light-600 sm:w-auto"
          >
            Okay, Got It
          </button>
        </div>
      </div>
    </Modal>
  );
}
