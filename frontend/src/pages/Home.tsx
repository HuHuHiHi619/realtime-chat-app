// pages/Home.tsx
import Snowfall from "@/components/common/SnowFall";
import Chat from "../components/chat/Chat";
import Conversation from "../components/chat/Conversation";
import Post from "../components/post/Post";
import { useUiStore } from "../store/useUiStore";
import { AnimatePresence, motion } from "motion/react";
import Profile from "@/components/auth/Profile";
import AnimatedView from "@/components/common/AnimatedView";

export default function Home() {
  const { currentView, sideView } = useUiStore();

  return (
    <>
      <div className="">
        {/* Sidebar / Conversations */}
        <div className="grid grid-cols-[minmax(300px,400px)_1fr] mx-40 gap-4">
          <aside>
            <AnimatePresence mode="wait">
              {sideView === "Conversation" && (
                <AnimatedView viewKey="conversation">
                  <Conversation />
                </AnimatedView>
              )}

              {sideView === "Profile" && (
                <AnimatedView viewKey="profile">
                  <Profile />
                </AnimatedView>
              )}
            </AnimatePresence>
          </aside>

          {/* Main Content */}
          <main className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentView === "Post" && (
                <AnimatedView viewKey="post">
                  <Post />
                </AnimatedView>
              )}

              {currentView === "Chat" && (
                <AnimatedView viewKey="chat">
                  <Chat />
                </AnimatedView>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
