import { RefObject } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import type { Message as MessageType } from "@shared/schema";

interface ConversationAreaProps {
  messages: MessageType[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export default function ConversationArea({ messages, isTyping, messagesEndRef }: ConversationAreaProps) {
  return (
    <div className="flex-1 py-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
