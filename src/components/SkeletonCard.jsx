const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
