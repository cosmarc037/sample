import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div 
        className="bg-white border rounded-2xl rounded-bl-md px-6 py-4 shadow-sm"
        style={{ borderColor: "var(--pe-border)" }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center pe-gradient"
          >
            <Brain className="text-white w-4 h-4" />
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-500">Analyzing...</span>
        </div>
      </div>
    </div>
  );
}
