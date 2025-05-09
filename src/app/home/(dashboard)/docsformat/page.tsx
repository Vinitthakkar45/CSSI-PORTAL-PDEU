'use client';
import React from 'react';
import { Download, FileText, Award, Presentation, Book, Info } from 'lucide-react';
import Image from 'next/image';

const DocsFormatPage = () => {
  const documents = [
    {
      title: 'CSSI Handbook',
      description: 'Complete guidelines and information about the CSSI program',
      icon: <Book className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      iconBg: 'bg-blue-100 dark:bg-blue-800/30',
      filePath: '/pdfs/cssi-handbook.pdf',
    },
    {
      title: 'Report Format',
      description: 'Template and guidelines for creating your CSSI report',
      icon: <FileText className="w-10 h-10 text-cyan-500" />,
      color: 'bg-cyan-50 dark:bg-cyan-900/20',
      borderColor: 'border-cyan-200 dark:border-cyan-700',
      iconBg: 'bg-cyan-100 dark:bg-cyan-800/30',
      filePath: '/pdfs/report-format.pdf',
    },
    {
      title: 'Poster Format',
      description: 'Design specifications for your CSSI poster presentation',
      icon: <Presentation className="w-10 h-10 text-teal-500" />,
      color: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-700',
      iconBg: 'bg-teal-100 dark:bg-teal-800/30',
      filePath: '/pdfs/poster-format.pdf',
    },
    {
      title: 'Certificate Format',
      description: 'Template for CSSI completion certificate',
      icon: <Award className="w-10 h-10 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      iconBg: 'bg-purple-100 dark:bg-purple-800/30',
      filePath: '/pdfs/certificate-format.pdf',
    },
  ];

  const handleDownload = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Document Formats</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Download official templates and formats required for your CSSI internship
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl border ${doc.borderColor} ${doc.color} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg ${doc.iconBg} p-3`}>{doc.icon}</div>
              <button
                onClick={() => handleDownload(doc.filePath)}
                className="flex items-center space-x-1 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{doc.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{doc.description}</p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/10 blur-xl"></div>
          </div>
        ))}
      </div>

      {/* SDG Section */}
      <div className="mt-10 rounded-xl border border-emerald-100 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sustainable Development Goals</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            CSSI projects align with the UN Sustainable Development Goals. Consider these goals when planning your
            internship.
          </p>
          <div className="relative w-full h-64 md:h-80 mt-2 overflow-hidden rounded-lg">
            <Image
              src="/images/profiles/SDG.jpg"
              alt="UN Sustainable Development Goals"
              fill
              style={{ objectFit: 'contain' }}
              className="transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-blue-100 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/10 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Need help with these documents?</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Refer to the CSSI guidelines or contact your faculty coordinator for assistance.
            </p>
          </div>
          <a
            href="/guidelines"
            className="mt-4 md:mt-0 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            View Guidelines
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocsFormatPage;
