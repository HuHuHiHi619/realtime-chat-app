import ActionButton from "../common/ActionButton";
import { ThumbsUp, MessageCircle, Share } from "lucide-react";

function PostActions({ postId, likes, comments }: any) {
  return (
    <div className="mx-4 ">
      {/* Stats */}
      <div className="border-b pb-2 flex justify-between text-gray-300 text-sm ">
        {likes > 0 && <span>{likes} likes</span>}
        {comments > 0 && <span>{comments} comments</span>}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <ActionButton
          icon={ThumbsUp}
          text="Like"
          className="hover:bg-brandChoco-50 hover:text-white border border-transparent text-brandChoco-50"
          iconClassName="w-5 h-5 "
          textClassName="text-sm "
        />
        <ActionButton
          icon={MessageCircle}
          text="Comment"
          className="hover:bg-brandChoco-50 hover:text-white border border-transparent  text-brandChoco-50"
          iconClassName="w-5 h-5"
          textClassName="text-sm "
        />
        <ActionButton
          icon={Share}
          text="Share"
          className=" hover:bg-brandChoco-50 hover:text-white border border-transparent  text-brandChoco-50"
          iconClassName="w-5 h-5"
          textClassName="text-sm "
        />
      </div>
    </div>
  );
}

export default PostActions;
