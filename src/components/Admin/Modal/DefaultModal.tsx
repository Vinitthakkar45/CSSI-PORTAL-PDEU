'use client';
import React from 'react';

import { Modal } from '@/components/Home/ui/modal';

interface DefaultModalProps {
  stage_data: {
    number: number;
    title: string;
    description: string;
    long_description: string;
  };
  closeModal: () => void;
  isOpen: boolean;
}

const DefaultModal: React.FC<DefaultModalProps> = ({ stage_data, closeModal, isOpen }: DefaultModalProps) => {
  const { number, title, description, long_description } = stage_data;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">Stage {number}</h4>
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
      <p className="text-md leading-6 text-gray-500 dark:text-gray-400">{description}</p>
      <br />
      <hr />
      <p className="mt-5 text-md leading-6 text-gray-500 dark:text-gray-400">{long_description}</p>
      <br />
    </Modal>
  );
};

export default DefaultModal;
