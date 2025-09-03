import { useAuthStore } from "@/store";
import FeedLayout from "../common/FeedLayout";
import PostInput from "./PostInput";
import PostInputCard from "./PostInputCard";
import PostLists from "./PostLists";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";
import { withAbortController } from "@/helper/withAbortController";

function Post() {
  const { posts, fetchPosts } = usePostStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchPosts();
  }, [isAuthenticated, fetchPosts]);

  return (
    <>
      <FeedLayout>
        <div className="mx-24 bg- bg-gray-200 rounded-2xl">
          <PostInput />
        </div>
        <div className="mx-24 my-5  bg-gray-200 rounded-2xl">
          {posts.map((post) => (
            <PostLists key={post.id} post={post} />
          ))}
        </div>
      </FeedLayout>
      <PostInputCard />
    </>
  );
}

export default Post;
