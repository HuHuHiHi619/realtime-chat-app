import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import { formatDate } from "@/helper/formatDate";

import { useAuthStore } from "@/store";

function PostLists({ post }: any) {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-brandCream-50 to-brandCream-100 ring-border rounded-2xl shadow-md">
      <PostHeader
        username={post.author.username}
        createdAt={formatDate(post.created_at)}
        postId={post.id}
      />
      <PostContent content={post.content} />
      <PostActions postId={post.id} likesCount={post.likesCount} isLiked={post.isLiked} />
    </div>
  );
}

export default PostLists;
