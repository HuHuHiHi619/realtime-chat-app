import { usePostStore, useUiStore } from "@/store";
import { useEffect, useRef } from "react";
import { Ellipsis, Bookmark, Trash2} from "lucide-react";

function PostHeader({ user, createdAt , postId }: any) {
  const { isPostMenuOpen, togglePostMenuOpen } = useUiStore();
  const { deletePost } = usePostStore();
  const postMenuRef = useRef<HTMLDivElement>(null);

  const handleDelete = async (post_id : number) => {
    try{
      deletePost(post_id)
    }catch(error){
      console.error(error)
    }
  }


  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        postMenuRef.current &&
        !postMenuRef.current.contains(event.target as Node) &&
        isPostMenuOpen
      ) {
        togglePostMenuOpen();
      }
    };

    if (isPostMenuOpen) {
      document.addEventListener("click", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, [isPostMenuOpen, togglePostMenuOpen]);

  useEffect(() => {
    const postMenu = document.getElementById("post-menu");

    if (isPostMenuOpen) {
      postMenu?.classList.add("show");
    } else {
      postMenu?.classList.remove("show");
    }

    return () => {
      postMenu?.classList.remove("show");
    };
  }, [isPostMenuOpen]);

  return (
    <div className="my-4 mx-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <img className="w-10 h-10 rounded-full bg-amber-600 border-none" />
          <div className="flex flex-col">
            <p className="font-semibold text-brandChoco-50">
              SAMPLE USER{user}
            </p>
            <p className="text-brandChoco-50 text-sm opacity-70">{createdAt}</p>
          </div>
        </div>
        <div
          ref={postMenuRef}
          className="post-menu-trigger"
          onClick={togglePostMenuOpen}
        >
          <div className="mr-2 p-2 rounded-full text-brandChoco-50 hover:bg-brandChoco-50 hover:text-white transition-all ease-in-out duration-300">
            <Ellipsis />
          </div>
          <div className={`post-menu ${isPostMenuOpen ? "show" : ""}`}>
            <div  className=" hover:bg-brandCream-50 hover:text-brandChoco-50 p-2 rounded-md flex gap-1 transition-all ease-in-out duration-300">
              <Bookmark />
              <p>save post</p>
            </div>
            <div onClick={() => handleDelete(postId)} className="hover:bg-brandCream-50 hover:text-brandChoco-50 p-2 rounded-md flex gap-1 transition-all ease-in-out duration-300">
              <Trash2 />
              <p>delete post</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
