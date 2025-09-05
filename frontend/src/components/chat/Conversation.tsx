import { useEffect } from "react";
import { useAuthStore, useChatStore } from "../../store";
import LogoutButton from "../common/LogoutButton";
import { useUiStore } from "../../store/useUiStore";

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
  const { setCurrentView } = useUiStore();

  // STATE
  const { conversations } = useChatStore((state) => state);
  const { isAuthenticated } = useAuthStore((state) => state);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchConversations();
  }, [isAuthenticated]);

  return (
    <div className=" p-6 h-screen ">
      <div className=" h-full overflow-hidden outline-4 outline-offset-2 outline-white rounded-4xl">
        {/* Sidebar - Conversation List */}
        <div className="h-full p-4 rounded-2xl bg-brandCream-50 flex-shrink-0 ">
          {/* Sidebar Header */}
          <div className="grid grid-cols-2 items-center gap-24 px-4 pb-4  border-b border-b-gray-200">
            <div className="text-2xl font-bold text-brandChoco-50">Messages</div>
            <LogoutButton />
          </div>

          {/* Conversation List */}
          <ul className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
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
                    className={`flex flex-row items-center rounded-xl cursor-pointer p-4 mx-2 hover:bg-brandCream-100 active:bg-sky-400`}
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-indigo-500 flex-shrink-0">
                      {initial}
                    </div>
                    <div className="flex flex-col flex-grow ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          <p>{name}</p>
                          {conversation.last_message && (
                            <p>{conversation.last_message.content}</p>
                          )}
                        </div>
                    </div>
                  </li>
                );
              })
            ) : (
              // It's good practice to show a message when the list is empty
              <div className="text-center text-gray-500 p-4">
                No conversations yet.
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
