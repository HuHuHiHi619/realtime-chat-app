import React, { useState } from "react";
import { useAuthStore, useChatStore } from "../../store";

function ChatInput() {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { inputMessage, activeConversation, setInputMessage, createMessage } =
    useChatStore();

  const handleEnterCreateMessage = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    console.log("input say: ", inputMessage);
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
          sender_id: user.id,
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
      sender_id: user.id ,
      content: inputMessage,
      message_type: "TEXT",
    });
  };

  return (
    <div className="flex items-center h-16 bg-white rounded-xl px-4">
      <button className="h-10 w-10 text-black hover:bg-indigo-500 rounded-full">
        <svg
          className="h-6 w-6 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586"
          />
        </svg>
      </button>
      <div className="flex-grow ml-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleEnterCreateMessage}
          className="w-full border rounded-xl pl-4 h-10 focus:outline-none focus:border-indigo-300"
          placeholder="Type your message..."
        />
      </div>
      <button
        onClick={handleClickCreateMessage}
        className="ml-4 px-4 py-1 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white"
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
