import React, { useState } from "react";
import { useAuthStore, useChatStore } from "../../store";
import { Paperclip } from "lucide-react";

function ChatInput() {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { inputMessage, activeConversation, setInputMessage, createMessage } =
    useChatStore();

  const handleEnterCreateMessage = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!inputMessage.trim()) return;

    if (!activeConversation?.conversation_id) {
      setError("No active conversation");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }
    try {
      if (e.key === "Enter") {
        createMessage({
          conversation_id: activeConversation.conversation_id,
          content: inputMessage.trim(),
          message_type: "TEXT",
        });
      }
    } catch (error) {
      setError("Failed to create message");
      console.error("Send message error:", error);
    }
  };

  const handleClickCreateMessage = () => {
    if (!inputMessage.trim()) return;

    if (!activeConversation?.conversation_id) {
      setError("No active conversation");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    createMessage({
      conversation_id: activeConversation?.conversation_id,
      content: inputMessage,
      message_type: "TEXT",
    });
  };

  return (
    <div
      className="flex items-center gap-3 h-16 bg-white/70 rounded-2xl px-5 
              shadow-sm border border-brandChoco-50/20 hover:shadow-md 
              transition-all duration-200"
    >
      <button
        className="bg-brandChoco-50 p-2.5 text-white hover:bg-brandChoco-100 
                   transition-colors duration-200 rounded-xl flex-shrink-0
                   hover:shadow-sm"
      >
        <Paperclip className="w-4 h-4" />
      </button>

      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleEnterCreateMessage}
        className="flex-1 bg-transparent border-none focus:outline-none 
             text-brandChoco-50 placeholder-brandChoco-100/60 text-xl"
        placeholder="Message..."
      />

      <button
        onClick={handleClickCreateMessage}
        className="bg-brandChoco-50 hover:bg-brandChoco-100 px-4 py-2 
             rounded-xl text-white text-lg font-medium transition-colors 
             duration-200 flex-shrink-0 disabled:opacity-50"
        disabled={!inputMessage.trim()}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
