import { useAuthStore } from "@/store";
import FeedLayout from "../common/FeedLayout";
import PostInput from "./PostInput";
import PostInputCard from "./PostInputCard";
import PostLists from "./PostLists";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";
import { Panda } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";



function Post() {
  const { postsById , postIds , fetchPosts } = usePostStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPosts();
  }, [isAuthenticated, fetchPosts ]);

  return (
    <>
      <FeedLayout>
        <div className="mx-10">
          <PostInput />
        </div>
        {postIds.length > 0 ? (
          <div className="mx-10 my-5 grid gap-6">
            { postIds.map((id) => {
              const post = postsById[id]
     
              return <PostLists key={id} post={post} />
            }) }
            <ConfirmDialog />
          </div>
        ) : 
        <div className="relative">
          <div className="absolute top-30 left-1/2 transform -translate-x-1/2">
            <Panda size={430} className="text-brandChoco-50 opacity-20"/>
          </div>
        </div>}
      </FeedLayout>
      <PostInputCard />
    </>
  );
}

export default Post;
