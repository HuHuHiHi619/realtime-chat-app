import { useAuthStore, usePostStore, useUiStore } from "@/store";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CircleXIcon } from "lucide-react";

function PostInputCard() {
  const { togglePostInputOpen, isPostInputOpen } = useUiStore();
  const { createPost } = usePostStore();
  const { user } = useAuthStore();
  const [postInput, setPostInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setPostInput(value);
  };

  const handleSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        setError("User not authenticated");
        return;
      }
      if (!postInput.trim()) return;
      createPost({ author_id: user.id, content: postInput });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById("post-input-modal");

    if (modal) {
      if (isPostInputOpen) {
        modal.classList.add("show");
      } else {
        modal.classList.remove("show");
      }
    }
    return () => {
      if (modal) {
        modal.classList.remove("show");
      }
    };
  }, [isPostInputOpen]);

  if (isPostInputOpen === false) return null;

  return createPortal(
  <div className="relative ring-border bg-brandCream-50 rounded-2xl overflow-hidden scale-120">
    {/* HEADER  */}
    <div className="flex items-center justify-center py-3 border-b border-b-brandChoco-50">
      <h2 className="uppercase tracking-tight text-3xl px-40 text-[#8b4513] font-bold">
        Create post
      </h2>
      <CircleXIcon
        onClick={togglePostInputOpen}
        className="absolute top-3 right-3 text-2xl text-[#cd853f] hover:text-[#ff6b6b] w-9 h-9 rounded-full cursor-pointer transition-colors duration-200 hover:bg-[#fff0e6] p-1"
      />
    </div>

    {/* USER  */}
    <div className="flex items-center gap-3 px-2 py-4 bg-brandCream-50 text-base">
      <div className="w-10 h-10 rounded-full bg-[#d18420] flex items-center justify-center text-white font-bold">
        🧁
      </div>
      <div className="space-y-1">
        <p className="text-[#8b4513] font-semibold text-xl">{user?.username}</p>
        <span className="bg-brandChoco-100 text-white rounded-full px-3 py-1 text-sm">
          🔒 Sweet & Private
        </span>
      </div>
    </div>

    {/* INPUT  */}
    <div className="px-3 py-2 bg-brandCream-50">
      <form onSubmit={handleSubmitPost} className="space-y-4">
        <div className="relative">
          <textarea
            onChange={handleOnChange}
            value={postInput}
            className="w-full px-4 pb-8 pt-4 focus:outline-none bg-white rounded-xl placeholder:text-brandChoco-50 text-2xl text-brandChoco-50 transition-all transform duration-600 ease-in-out"
            placeholder="🍰 What sweet thoughts are on your mind?"
          />
        </div>

        <button
          type="submit"
          className="bg-brandStrawberry-50 shadow-inner hover:bg-brandGreen-50 text-white p-2 w-full rounded-xl text-2xl cursor-pointer font-semibold hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          Sweet Post
        </button>
      </form>
    </div>

    {/* Decorative cake elements */}
    <div className="absolute top-3 left-24 text-[#deb887] text-4xl">🍰 </div>
    <div className="absolute bottom-5 left-36 text-[#deb887] text-2xl">🎂</div>
    <div className="absolute top-2 left-2 text-[#deb887] text-xs">🧁</div>
    <div className="absolute top-18 right-8 text-[#f4a460] text-xs">🍯</div>
    <div className="absolute bottom-20 left-6 text-[#cd853f] text-xs">🍪</div>
  </div>,
  document.getElementById("post-input-modal")!
);
}

export default PostInputCard;
