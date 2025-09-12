import { usePostStore, useUiStore } from "@/store";
import ActionButton from "../common/ActionButton";
import { Heart, MessageCircle, Share } from "lucide-react";

function PostActions({ postId, likes, comments, isLiked }: any) {
  const { toggleLike } = usePostStore();
  const { openPost } = useUiStore();

  return (
    <div className="mx-4 ">
      {/* Stats */}
      <div className=" pb-2 flex justify-between ">
        {likes > 0 && (
          <div
            className={`flex items-center gap-2 py-2 ${
              isLiked ? "text-brandStrawberry-100" : ""
            }`}
          >
            <span className={`flex items-center justify-center w-8 h-8 mb-0.5 text-brandChoco-50 ${isLiked ? "bg-brandStrawberry-50 text-white" : ""} rounded-full`}>
              <Heart size={21}  strokeWidth={2} />
            </span>
            <span className="text-xl text-brandChoco-50">{likes}</span>
          </div>
        )}
        {comments > 0 && <span>{comments} comments</span>}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-4 my-2 pb-2">
        <ActionButton
          action={() => {
            toggleLike(postId);
          }}
          icon={Heart}
          text="Like"
          className={`shadow-inner text-lg ${isLiked ? "bg-brandStrawberry-50" : ""} text-brandChoco-50 hover:bg-brandCream-50 hover:scale-105 transition-all duration-300`}
          iconClassName={`${isLiked ? "text-white" : ""}`}
          textClassName={`${
            isLiked ? "text-white font-bold" : ""
          }`}
        />
        <ActionButton
          action={() => {
            openPost(postId);
          }}
          icon={MessageCircle}
          text="Comment"
          className="shadow-inner text-lg text-brandChoco-50 hover:bg-brandCream-50 hover:scale-105 transition-all duration-300"
          iconClassName="w-5 h-5"
          textClassName=""
        />
        <ActionButton
          action={() => console.log("clicked")}
          icon={Share}
          text="Share"
          className="shadow-inner text-lg text-brandChoco-50 hover:bg-brandCream-50 hover:scale-105 transition-all duration-300"
          iconClassName="w-5 h-5"
          textClassName=""
        />
      </div>
    </div>
  );
}

export default PostActions;
