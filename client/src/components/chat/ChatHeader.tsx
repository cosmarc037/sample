import { Download, Trash2, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onExport: () => void;
  onClear: () => void;
  onConfigureAzure: () => void;
  onHome: () => void;
}

export default function ChatHeader({ onExport, onClear, onConfigureAzure, onHome }: ChatHeaderProps) {
  return (
    <header className="bg-white border-b px-4 py-3 flex-shrink-0" style={{ borderColor: "var(--pe-border)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--pe-primary)" }}
          >
            <TrendingUp className="text-white w-4 h-4" />
          </div>
          <button
            onClick={onHome}
            className="text-xl font-semibold hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: "var(--pe-text)" }}
            title="Go to home"
          >
            PE Research AI
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onConfigureAzure}
            className="hover:text-blue-600"
            title="Configure Azure OpenAI"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="hover:text-orange-600"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
