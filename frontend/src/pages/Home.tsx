// pages/Home.tsx
import Chat from "../components/chat/Chat";
import Conversation from "../components/chat/Conversation";
import Post from "../components/post/Post";
import { useUiStore } from "../store/useUiStore";

export default function Home() {

  const { currentView } = useUiStore()

  return (
    <>
      <div className="">
        {/* Sidebar / Conversations */}
        <div className="grid grid-cols-[minmax(300px,400px)_1fr] mx-40 gap-4">
          <aside>
            <Conversation />
          </aside>

          {/* Main Content */}
          <main>
            { currentView === 'Post' ? <Post /> : null}
            { currentView === 'Chat' ? <Chat /> : null}
          </main>
          </div>
      </div>
    </>
  );
}
