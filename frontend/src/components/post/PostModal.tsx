import { usePostStore, useUiStore } from "@/store";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

function PostModal() {
  const { postsById } = usePostStore();
  const { activePostId, isPostOpen , closePost } = useUiStore();

  
  useEffect(() => {
    const modal = document.getElementById("post-modal");
    if(modal){
      if(isPostOpen){
        modal.classList.add('show')
      } else {
        modal.classList.remove('show')
      }
    }
    return () => {
      if(modal){
        modal.classList.remove('show')
      }
    }
  },[isPostOpen])
  if (!activePostId) return null;

  const post = postsById[activePostId];

  if (!post) return null;
  console.log(post)
  return createPortal(
    <div className="fixed   flex items-center ">
      <div className="bg-white p-4 rounded-xl w-[600px]">
        <button onClick={closePost} className="bg-red-600 p-4 text-white">X</button>
        <h2>{post.author_id}</h2>
        <p>{post.content}</p>
        {/* render comments here */}
      </div>
    </div>,
    document.getElementById("post-modal")!
  );
}

export default PostModal;
