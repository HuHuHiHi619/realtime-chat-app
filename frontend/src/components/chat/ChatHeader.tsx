import { useAuthStore, useChatStore } from "../../store";
import { useUiStore } from "../../store/useUiStore";
import { ArrowLeftFromLine } from "lucide-react";

function ChatHeader() {
  const { user } = useAuthStore();
  const { activeConversation } = useChatStore();
  const { setCurrentView } = useUiStore();
  const friend = activeConversation?.participants.find(
    (p) => p.id !== user?.id
  );

  return (
    <div className="flex items-center justify-between h-16 w-full px-3 mb-4">
      <div>
        <div className="text-2xl mt-1 flex items-center gap-4">
          <button
            onClick={() => setCurrentView("Post")}
            className="p-2 rounded-full shadow-inner text-brandCream-50 bg-brandChoco-50 cursor-pointer hover:scale-110 transition-all duration-200"
          >
            <ArrowLeftFromLine />
          </button>
          <div className="flex items-center bg-brandCream-50 p-2 rounded-full">
            <span className="text-brandChoco-50 mx-3">{friend?.username}</span>
            <span className=" w-3 h-3 rounded-full bg-green-500"></span>
          </div>
        </div>
      </div>
      <button className="inline-flex items-center justify-center rounded-full h-10 w-10 text-gray-500 hover:bg-gray-300">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01"
          />
        </svg>
      </button>
    </div>
  );
}

export default ChatHeader;
