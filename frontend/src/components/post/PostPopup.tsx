import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import FeedLayout from "../common/FeedLayout";

function PostPopup() {
  return (
    <FeedLayout>
      <div className="mx-24 my-5  rounded-2xl">
        <PostHeader />
        <PostContent />
        <PostActions />
      </div>
    </FeedLayout>
  );
}

export default PostPopup;
