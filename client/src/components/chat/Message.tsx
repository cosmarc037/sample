import { Clock, Copy, Download, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Message as MessageType } from "@shared/schema";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const { toast } = useToast();
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([message.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pe-research-message-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Message exported successfully.",
    });
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div 
          className="max-w-3xl text-white rounded-2xl rounded-br-md px-6 py-4"
          style={{ backgroundColor: "var(--pe-primary)" }}
        >
          <p className="leading-relaxed">{message.content}</p>
          <div className="text-xs text-orange-100 mt-2 flex items-center justify-end">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-up">
      <div 
        className="max-w-4xl bg-white border rounded-2xl rounded-bl-md px-6 py-5 shadow-sm"
        style={{ borderColor: "var(--pe-border)" }}
      >
        <div className="flex items-start space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 pe-gradient"
          >
            <Brain className="text-white w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="prose max-w-none">
              <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "var(--pe-text)" }}>
                {message.content}
              </p>
            </div>
            <div 
              className="flex items-center justify-between mt-4 pt-3 border-t"
              style={{ borderColor: "var(--pe-border)" }}
            >
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{timestamp}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-500 hover:text-orange-600 p-1"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  className="text-gray-500 hover:text-orange-600 p-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
