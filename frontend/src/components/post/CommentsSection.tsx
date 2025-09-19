import React, { useEffect, useState } from "react";
import { FormInput } from "../common/FormInput";

import { useAuthStore } from "@/store";

import { useCommentStore } from "@/store/useCommentStore";
import { formatDate } from "@/helper/formatDate";

function CommentsSection({ post_id }: { post_id: number }) {
  const { user } = useAuthStore();
  const {
    commentIdsByPostId,
    commentsByIds,
    replyIdsByCommentId,
    createComment,
    fetchComments,
  } = useCommentStore();
  const [commentInput, setCommentInput] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCommentInput(value);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!user?.id) return;
      if (!commentInput.trim()) return;

      createComment({ author_id: user.id, post_id, content: commentInput });
      setCommentInput("");
    } catch (error) {
      console.error(error);
    }
  };
  const commentIds = commentIdsByPostId[post_id] || [];

  useEffect(() => {
    console.log(post_id);
  }, []);
  return (
    <div className="p-4 w-[700px]">
      {/* --- input comment --- */}
      <form onSubmit={handleCommentSubmit}>
        <FormInput
          name="comment"
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={handleOnChange}
        />
      </form>

      <span className="block mt-4 mb-2 text-brandChoco-50 font-semibold">
        Relevant
      </span>

      {/* --- loop comments --- */}
      <div className="space-y-4">
        {commentIds.map((id) => {
          const comment = commentsByIds[id];
          if (!comment) return null;

          const replyIds = replyIdsByCommentId[comment.id] || [];
          console.log(comment);
          return (
            <div key={comment.id}>
              <div className="flex gap-2">
                <img
                  className="w-10 h-10 rounded-full bg-amber-600 border-none"
                  alt="avatar"
                />
                <div>
                  <div className="flex flex-col p-2 rounded-2xl text-brandChoco-50 bg-brandCream-50">
                    <span className="font-semibold">{comment.author_id}</span>
                    <span className="text-lg">{comment.content}</span>
                  </div>
                  <div className="text-brandChoco-50 pl-3 flex gap-4 text-sm mt-1">
                    <span>{formatDate(comment.created_at)}</span>
                    <button className="hover:underline">Like</button>
                    <button
                      className="hover:underline"
                      
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* SEE MORE REPLIES  */}
              <div className="ml-12" onClick={() => fetchComments(post_id ,comment.id)}>
                {comment.replies > 1 ? (
                  <span className="p-2 rounded-2xl text-brandChoco-50 bg-brandCream-50">
                    see more replies {comment._count.replies} items
                  </span>
                ) : (
                  <span className=" text-brandChoco-50 text-sm pl-2">
                    see more reply {comment._count.replies} item
                  </span>
                )}
              </div>

              {replyIds.length > 0 ? (
                <div className="pl-14 space-y-2">
                  {replyIds.map((replyId) => {
                    const reply = commentsByIds[replyId];
                    if (!reply) return null;
                    return (
                      <div key={reply.id} className="flex gap-2">
                        <img
                          className="w-10 h-10 rounded-full bg-amber-600 border-none"
                          alt="avatar"
                        />
                        <div className="flex flex-col p-2 rounded-2xl text-brandChoco-50 bg-brandCream-50">
                          <span className="font-semibold">
                            {reply.author_id}
                          </span>
                          <span className="text-lg">{reply.content}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommentsSection;
