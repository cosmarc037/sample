import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ChatHeader from "@/components/chat/ChatHeader";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import ConversationArea from "@/components/chat/ConversationArea";
import MessageInput from "@/components/chat/MessageInput";
import AzureConfigModal from "@/components/AzureConfigModal";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message: messageContent,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now(),
      content: messageContent,
      role: "user",
      sessionId,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsWelcomeScreen(false);
    setIsTyping(true);

    sendMessageMutation.mutate(messageContent);
  };

  const handleSampleQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleExportConversation = () => {
    if (messages.length === 0) {
      toast({
        title: "No Conversation",
        description: "There are no messages to export.",
      });
      return;
    }

    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pe-research-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Conversation exported successfully.",
    });
  };

  const handleClearConversation = () => {
    if (messages.length === 0) return;
    
    setMessages([]);
    setIsWelcomeScreen(true);
    toast({
      title: "Cleared",
      description: "Conversation cleared successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--pe-background)" }}>
      <ChatHeader 
        onExport={handleExportConversation}
        onClear={handleClearConversation}
        onConfigureAzure={() => setIsConfigModalOpen(true)}
        onHome={handleClearConversation}
      />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        {isWelcomeScreen ? (
          <WelcomeScreen onSampleQuestion={handleSampleQuestion} />
        ) : (
          <ConversationArea 
            messages={messages} 
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}
      </main>

      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      />

      <AzureConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={() => {
          setIsConfigModalOpen(false);
          toast({
            title: "Configuration Updated",
            description: "Azure OpenAI settings have been saved successfully.",
          });
        }}
      />
    </div>
  );
}
