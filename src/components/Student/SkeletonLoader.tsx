import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="container mx-auto animate-pulse">
      {/* Stage Progress Skeleton */}
      <div className="md:mb-14">
        <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md mb-8 dark:bg-gray-700"></div>
        <div className="h-6 bg-gray-200 rounded w-[70%] mb-8 dark:bg-gray-700"></div>
      </div>

      {/* Stage Cards Skeleton */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-6 dark:border-gray-700">
            <div className="h-6 bg-gray-200 rounded w-16 mb-4 dark:bg-gray-700"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6 dark:bg-gray-700"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-40 mx-auto dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
