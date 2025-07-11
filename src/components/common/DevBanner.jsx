/**
 * Development environment banner component
 * Shows when the app is running in development mode
 */
const DevBanner = () => {
  return (
    <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm border-b border-yellow-200">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🧪</span>
        <span className="font-medium">TEST MODE ACTIVE</span>
        <span>-</span>
        <span>Development Environment</span>
      </div>
    </div>
  );
};

export default DevBanner;
