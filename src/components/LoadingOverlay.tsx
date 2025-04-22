const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
    </div>
  );
};

export default LoadingOverlay;
