import { useAuthStore, useChatStore } from "../../store";

interface ChatMessageListProps {
  bottomRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

function ChatMessageList({ bottomRef , chatContainerRef }: ChatMessageListProps) {
  const { user } = useAuthStore();
  const { messages } = useChatStore();
 
  return (
    <div ref={chatContainerRef} className="flex flex-col h-full overflow-y-auto mb-4">
        <div className="flex flex-col h-full">
          {messages.length > 0 ? (
            messages.map((msg , index) => {
              const isOwn = msg.sender_id === user?.id;
      
              return (
                <div
                  key={`${msg.id}-${index}`}
                  className={`p-3 rounded-lg flex ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      isOwn ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      {isOwn ? "You" : "Her"}
                    </div>
                    <div
                      className={`text-brandChoco-50  py-2 px-4 rounded-xl shadow ${
                        isOwn ? "mr-3 bg-brandChoco-50 text-white" : "ml-3 bg-brandCream-50"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400 mt-8">
              No messages yet.
            </div>
          )}
          <div ref={bottomRef} />
        </div>
    </div>
  );
}
export default ChatMessageList;
