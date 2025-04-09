import { Modal } from '../Home/ui/modal';

type ModalType = {
  title: string;
  message: string;
  buttonInfo: string;
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
};

export function InfoModal({ title, message, buttonInfo, isOpen, onClose, onCloseCross }: ModalType) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseCross}
      className="w-[90%] lg:max-w-[600px] sm:max-w-[500px] p-4 sm:p-6 lg:p-8"
    >
      <div className="text-center">
        <h4 className="text-lg sm:text-xl mb-2 lg:text-2xl font-semibold text-gray-800 dark:text-white/90">{title}</h4>
        <p className="text-sm sm:text-base leading-6 text-gray-500 dark:text-gray-400">{message}</p>
        <div className="flex items-center justify-center w-full gap-3 mt-7">
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center w-full px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium text-white rounded-lg bg-blue-light-500 shadow-theme-xs hover:bg-blue-light-600 sm:w-auto"
          >
            {buttonInfo}
          </button>
        </div>
      </div>
    </Modal>
  );
}
