const TypingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500 p-4 rounded-lg bg-gray-50 shadow-sm max-w-sm">
    <div
      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    ></div>
    <div
      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.4s" }}
    ></div>
    <span className="text-sm font-medium ml-1">AI is thinking...</span>
  </div>
);

export default TypingIndicator;
