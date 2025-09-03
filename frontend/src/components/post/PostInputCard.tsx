import { useAuthStore, usePostStore , useUiStore } from "@/store";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function PostInputCard() {
  const { togglePostInputOpen, isPostInputOpen } = useUiStore();
  const { createPost } = usePostStore()
  const { user } = useAuthStore()
  const [postInput, setPostInput] = useState<string>("");
  const [error , setError] = useState<string | null>(null)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
    setPostInput(value);
  };

  const handleSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!user?.id) {
      setError("User not authenticated");
      return;
      }
      console.log(postInput);
      createPost
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById("modal");

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
    <div className="relative bg-red-900 rounded-2xl ">
      {/* HEADER  */}
      <div className="flex items-center justify-center py-3 border-b">
        <h2 className="uppercase text-4xl px-40">Create post</h2>
        <button
          onClick={togglePostInputOpen}
          className="absolute top-3 right-3 text-2xl bg-red-600 text-white w-10 h-10 rounded-full cursor-pointer hover:bg-red-700 "
        >
          X
        </button>
      </div>

      {/* USER  */}
      <div className="flex items-center gap-3 px-2 py-4">
        <img className="w-10 h-10 rounded-full bg-amber-600 border-none" />
        <div>
          <p>USER NAME</p>
          <p className="bg-amber-400 rounded-md px-2">private</p>
        </div>
      </div>

      {/* INPUT  */}
      <div className="px-3 py-2">
        <form onSubmit={handleSubmitPost}>
          <input
            onChange={handleOnChange}
            value={postInput}
            type="text"
            className="w-full px-4 pb-8 focus:outline-none"
            placeholder="What's on your mind"
          />
        </form>
        <button className="bg-emerald-600 p-2 w-full rounded-xl text-2xl cursor-pointer hover:bg-emerald-700">
          Post
        </button>
      </div>
    </div>,
    document.getElementById("modal")!
  );
}

export default PostInputCard;
