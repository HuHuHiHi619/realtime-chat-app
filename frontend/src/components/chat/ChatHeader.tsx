import { useAuthStore, useChatStore } from "../../store";
import { useUiStore } from "../../store/useUiStore";

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
        <div className="text-2xl mt-1 flex items-center">
          <button
            onClick={() => setCurrentView("Post")}
            className="bg-blue-500 p-2 rounded-2xl text-white cursor-pointer hover:bg-blue-600 "
          >
            back
          </button>
          <span className="text-gray-700 mx-3">
            Chat with {friend?.username}
          </span>
          <span className="flex w-3 h-3 rounded-full bg-green-500"></span>
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
