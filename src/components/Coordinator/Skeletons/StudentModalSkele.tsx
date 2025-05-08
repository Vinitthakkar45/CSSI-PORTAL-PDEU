export default function StudentModalSkele() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      <div className="flex justify-center gap-20 mb-5">
        <div className="w-40 h-40 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="flex flex-col justify-center space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      </div>
    </div>
  );
}
