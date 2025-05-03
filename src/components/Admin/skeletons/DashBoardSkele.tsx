import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="container pb-4 mx-auto">
      {/* StageProgress Skeleton */}
      <div className="w-full lg:mb-4 mx-auto animate-pulse">
        <div className="lg:flex items-center justify-between gap-20">
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center">
              <div className="h-7 bg-gray-200 rounded-md w-48 dark:bg-gray-700"></div>
              <div className="h-6 bg-gray-200 rounded-full w-28 dark:bg-gray-700"></div>
            </div>

            <div className="mt-2 md:mt-6 relative">
              <div className="absolute top-5 left-1 right-1 h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>

              <div className="relative z-10 flex justify-between">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:min-w-40 mt-6">
            <div className="h-10 bg-gray-200 rounded-md w-40 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      {/* StageCards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="relative lg:flex flex-col rounded-xl border p-6 hidden
                       border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex">
        <div className="h-10 bg-gray-200 rounded-md w-32 mr-4 dark:bg-gray-700"></div>
        <div className="h-10 bg-gray-200 rounded-md w-32 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
