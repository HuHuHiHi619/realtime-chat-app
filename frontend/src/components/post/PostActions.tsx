import { usePostStore, useUiStore } from "@/store";
import ActionButton from "../common/ActionButton";
import { Cake, MessageCircle, Share } from "lucide-react";

function PostActions({ postId, likes, comments , isLiked}: any) {
  
  const { toggleLike } = usePostStore()
  const { openPost } = useUiStore()
  
  return (
    <div className="mx-4 ">
      {/* Stats */}
      <div className="border-b pb-2 flex justify-between ">
        {likes > 0 && 
        <div className={`flex items-center gap-2 py-2 ${isLiked ? "text-brandStrawberry-100" : ""}`}>
          <span>
            {likes} 
          </span>        
          <span className="flex items-center justify-center w-8 h-8 bg-red-400 rounded-full">
            <Cake size={21} color="white" strokeWidth={2} />
          </span>
          
        </div>}
        {comments > 0 && <span>{comments} comments</span>}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <ActionButton
          action={() => {
            toggleLike(postId)
          }}
          icon={Cake}
          text="Like"
          className="hover:bg-brandCream-50 border border-transparent text-brandChoco-50"
          iconClassName={`${isLiked ? "text-brandStrawberry-100" : ""}`}
          textClassName={`${isLiked ? "text-brandStrawberry-100 font-bold" : ""}`}
        />
        <ActionButton
          action={() => openPost(postId) }
          icon={MessageCircle}
          text="Comment"
          className="hover:bg-brandCream-50  border border-transparent  text-brandChoco-50"
          iconClassName="w-5 h-5"
          textClassName="text-sm "
        />
        <ActionButton
          action={() => console.log("share")}
          icon={Share}
          text="Share"
          className=" hover:bg-brandCream-50  border border-transparent  text-brandChoco-50"
          iconClassName="w-5 h-5"
          textClassName="text-sm "
        />
      </div>
    </div>
  );
}

export default PostActions;
