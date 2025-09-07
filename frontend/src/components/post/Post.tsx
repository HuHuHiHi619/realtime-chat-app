import { useAuthStore } from "@/store";
import FeedLayout from "../common/FeedLayout";
import PostInput from "./PostInput";
import PostInputCard from "./PostInputCard";
import PostLists from "./PostLists";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";
import PostModal from "./postModal";

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
        <div className="mx-24 rounded-2xl">
          <PostInput />
        </div>
        {postIds ? (
          <div className="mx-24 my-5 grid gap-4 rounded-2xl">
            { postIds.map((id) => {
              const post = postsById[id]
     
              return <PostLists key={id} post={post} />
            }) }
          <PostModal/>
          </div>

        ) : 
        <div className="mx-24 my-5 rounded-2xl text-center">
          <p className="font-bold text-brandChoco-50 text-3xl">YOU HAVE NO POST</p>
        </div>}
      </FeedLayout>
      <PostInputCard />
    </>
  );
}

export default Post;
