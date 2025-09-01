import { useEffect, useRef } from "react";
import { useAuthStore, useChatStore, useSocketStore } from "../../store";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import useChatScroll from "../../hooks/useChatScroll";
import { useNavigate } from "react-router-dom";
import FeedLayout from "../common/FeedLayout";

function Chat() {
  // STATE
  const { activeConversation, messages } = useChatStore();
  const { isAuthenticated } = useAuthStore();
  const { socket } = useSocketStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // FUNCTION
  const { fetchActiveConversation } = useChatStore();
  useChatScroll(chatContainerRef);

  // LOGOUT IF NO AUTHENTICATED
  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // SCROLL DOWN AUTO ON NEW MESSAGE
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  //  FETCH MESSAGES OF CONVERSATION
  useEffect(() => {
    if (socket && activeConversation?.conversation_id) {
      fetchActiveConversation(activeConversation.conversation_id).then(() => {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }, 0);
      });
      socket.emit("join-conversation", activeConversation.conversation_id);
    }
  }, [activeConversation?.conversation_id]);

  return (
    <FeedLayout>
      <ChatHeader />
      <ChatMessageList
        bottomRef={bottomRef}
        chatContainerRef={chatContainerRef}
      />
      <ChatInput />
    </FeedLayout>
  );
}
export default Chat;
