import { useEffect } from "react";
import { useAuthStore, useChatStore } from "../../store";
import LogoutButton from "../common/LogoutButton";
import { useUiStore } from "../../store/useUiStore";
import { UserRound } from "lucide-react";

function Conversation() {
  const getDisplayName = (friend: unknown) => {
    let name = "?";

    if (Array.isArray(friend)) {
      name = friend[0]?.username ?? "?";
    } else if (
      typeof friend === "object" &&
      friend !== null &&
      "username" in friend
    ) {
      name = (friend as { username: string }).username;
    }

    const initial = name.charAt(0).toUpperCase();
    return { initial, name };
  };

  // FUNCTIONS
  const { fetchConversations, fetchActiveConversation } = useChatStore(
    (state) => state
  );
  const { setCurrentView , setSideView } = useUiStore();

  // STATE
  const { conversations } = useChatStore((state) => state);
  const { isAuthenticated } = useAuthStore((state) => state);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchConversations();
  }, [isAuthenticated]);

  return (
    <div className="p-6 h-screen">
      <div className="h-full overflow-hidden rounded-3xl shadow-lg bg-brandCream-50 border border-brandChoco-50/20">
        {/* Sidebar - Conversation List */}
        <div className="h-full p-4 flex-shrink-0 flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-brandChoco-50/20">
            <h2 className="text-3xl font-bold text-brandChoco-50">Messages</h2>
            <div className="p-2 rounded-full shadow-inner text-brandChoco-50 hover:bg-brandChoco-50 hover:text-white cursor-pointer transition-all duration-200">
              <UserRound onClick={() => setSideView("Profile")} />
            </div>
          </div>

          {/* Conversation List */}
          <ul className="flex flex-col space-y-2 mt-4 -mx-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-brandChoco-100/30 scrollbar-track-transparent pr-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => {
                const { initial, name } = getDisplayName(conversation.friend);

                return (
                  <li
                    onClick={() => {
                      fetchActiveConversation(conversation.conversation_id);
                      setCurrentView("Chat");
                    }}
                    key={conversation.conversation_id}
                    className="flex flex-row shadow-inner items-center rounded-2xl cursor-pointer p-4 mx-2 transition-all duration-200 
                                hover:bg-brandCream-100/50 "
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full text-white bg-brandChoco-100 flex-shrink-0 shadow-inner">
                      {initial}
                    </div>
                    <div className="flex flex-col flex-grow ml-3">
                      <p className="text-lg font-semibold text-brandChoco-50">{name}</p>
                      {conversation.last_message && (
                        <p className=" text-brandChoco-50 truncate">
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="text-center text-brandChoco-100 p-4 italic">
                No conversations yet 🍫
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
