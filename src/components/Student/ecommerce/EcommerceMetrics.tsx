'use client';
import React from 'react';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';

// Import SVGs as image objects
import ArrowDownIcon from '@/icons/arrow-down.svg';
import ArrowUpIcon from '@/icons/arrow-up.svg';
import BoxIconLine from '@/icons/box-line.svg';
import GroupIcon from '@/icons/group.svg';

const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image src={GroupIcon.src} alt="Group Icon" width={24} height={24} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">3,782</h4>
          </div>
          <Badge color="success">
            <Image src={ArrowUpIcon.src} alt="Arrow Up" width={12} height={12} />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image src={BoxIconLine.src} alt="Box Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">5,359</h4>
          </div>

          <Badge color="error">
            <Image src={ArrowDownIcon.src} alt="Arrow Down" width={12} height={12} />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};

export default EcommerceMetrics;
