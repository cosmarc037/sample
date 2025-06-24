import { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "48px";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  return (
    <div className="flex-shrink-0 bg-white border-t px-4 py-4" style={{ borderColor: "var(--pe-border)" }}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about PE deals, company analysis, market intelligence..."
                className="resize-none rounded-2xl border pr-12 min-h-[48px] max-h-32 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                style={{ borderColor: "var(--pe-border)" }}
                rows={1}
                disabled={disabled}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || disabled}
                className="absolute right-2 bottom-2 w-8 h-8 p-0 rounded-xl"
                style={{ 
                  backgroundColor: message.trim() ? "var(--pe-primary)" : "rgb(156, 163, 175)",
                  opacity: disabled ? 0.5 : 1
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-right mt-3">
            <div className="text-xs text-gray-400">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Shift+Enter</kbd> for new line
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
