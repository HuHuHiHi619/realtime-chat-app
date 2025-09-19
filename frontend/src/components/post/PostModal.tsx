import { usePostStore, useUiStore } from "@/store";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { formatDate } from "@/helper/formatDate";
import CommentsSection from "./CommentsSection";
import { CircleXIcon , CakeSlice} from "lucide-react";
import { useCommentStore } from "@/store/useCommentStore";

function PostModal() {
  const { postsById, fetchPostById } = usePostStore();
  const { fetchComments } = useCommentStore();
  const { activePostId, isPostOpen, closePost } = useUiStore();

  useEffect(() => {
    if (!activePostId) return;
    fetchPostById(activePostId);
    fetchComments(activePostId)
  }, [activePostId, fetchPostById , fetchComments]);

  useEffect(() => {
    const modal = document.getElementById("post-modal");
    if (modal) {
      if (isPostOpen) {
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
  }, [isPostOpen]);

  if (!activePostId) return null;

  const post = postsById[activePostId];

  if (!post) return null;

  return createPortal(
    <div className="bg-gradient-to-br from-brandCream-50 to-brandCream-100 ring-border rounded-2xl shadow-md">
      <div className="text-brandChoco-50 text-2xl flex gap-4 justify-between  items-center pt-3 pb-2 border-b border-brandCream-100">
          <CakeSlice className="ml-5"/>
        <p>
          {post.author.username}'post
        </p>
        <button onClick={closePost} className="mr-4 ">
         <CircleXIcon size={30}/>
        </button>
      </div>
      <PostHeader
        username={post.author.username}
        createdAt={formatDate(post.created_at)}
        postId={post.id}
      />
      <PostContent content={post.content} />
      <PostActions
        postId={post.id}
        likesCount={post.likesCount}
        isLiked={post.isLiked}
      />
      <CommentsSection post_id={post.id} />
    </div>,
    document.getElementById("post-modal")!
  );
}

export default PostModal;
