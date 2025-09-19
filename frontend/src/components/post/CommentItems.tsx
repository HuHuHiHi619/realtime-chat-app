// CommentItem.tsx
import React, { useState } from "react";
import { formatDate } from "@/helper/formatDate";
import { useCommentStore } from "@/store/useCommentStore";
import { useAuthStore } from "@/store";
import { FormInput } from "../common/FormInput";

interface CommentItemProps {
  comment: any;
  isReply?: boolean;
  onReply?: (commentId: number) => void;
  repliesCount?: number;
  onShowReplies?: (commentId: number) => void;
  showReplies?: boolean;
  replies?: any[];
}

function CommentItem({ 
  comment, 
  isReply = false, 
  onReply, 
  repliesCount = 0,
  onShowReplies,
  showReplies = false,
  replies = []
}: CommentItemProps) {
  const { user } = useAuthStore();
  const { createComment } = useCommentStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id || !replyInput.trim()) return;
    
    createComment({ 
      author_id: user.id, 
      post_id: comment.post_id, 
      content: replyInput,
      parent_id: comment.id 
    });
    setReplyInput("");
    setShowReplyInput(false);
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-2">
        <img
          className="w-10 h-10 rounded-full bg-amber-600 border-none"
          alt="avatar"
        />
        <div className="flex flex-col p-2 rounded-2xl text-brandChoco-50 bg-brandCream-50">
          <span className="font-semibold">{comment.author_id}</span>
          <span className="text-lg">{comment.content}</span>
        </div>
      </div>
      
      <div className="text-brandChoco-50 pl-14 flex gap-4 text-sm mt-1">
        <span>{formatDate(comment.created_at)}</span>
        <button className="hover:underline">Like</button>
        
        {!isReply && (
          <button 
            className="hover:underline" 
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            Reply
          </button>
        )}
        
        {!isReply && repliesCount > 0 && (
          <button 
            className="hover:underline font-semibold" 
            onClick={() => onShowReplies?.(comment.id)}
          >
            {showReplies ? 'Hide' : `View ${repliesCount}`} replies
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && !isReply && (
        <div className="ml-14 mt-2">
          <form onSubmit={handleReplySubmit}>
            <FormInput
              name="reply"
              type="text"
              placeholder="Write a reply..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;