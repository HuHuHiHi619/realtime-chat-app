import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import FeedLayout from "../common/FeedLayout";
import PostInput from "./PostInput";

function Post() {
  return (
    <FeedLayout>
      <div className="mx-24 bg- bg-gray-200 rounded-2xl">
        <PostInput />
      </div>
      <div className="mx-24 my-5  bg-gray-200 rounded-2xl">
        <PostHeader />
        <PostContent />
        <PostActions />
      </div>
    </FeedLayout>
  );
}

export default Post;
