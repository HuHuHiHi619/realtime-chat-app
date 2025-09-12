
import PostActions from './PostActions'
import PostContent from './PostContent'
import PostHeader from './PostHeader'
import { formatDate } from '@/helper/formatDate'
import PostModal from "./PostModal";
import { useEffect } from 'react';


function PostLists({ post } : any) {
  useEffect(() => {
    console.log(post)
  },[])
  return (
    <div className='bg-gradient-to-br from-brandCream-50 to-brandCream-100 ring-border rounded-2xl shadow-md'>
        <PostHeader username={post.author.username} createdAt={formatDate(post.created_at)} postId={post.id}/>
        <PostContent content={post.content} />
        <PostActions postId={post.id} likes={post.likes} isLiked={post.isLiked} />

        <PostModal />
    </div>
  )
}

export default PostLists