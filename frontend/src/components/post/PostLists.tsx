import React from 'react'
import PostActions from './PostActions'
import PostContent from './PostContent'
import PostHeader from './PostHeader'
import { formatDate } from '@/helper/formatDate'


function PostLists({ post } : any) {
  return (
    <div>
        <PostHeader user={post.author_id} createdAt={formatDate(post.created_at)}/>
        <PostContent content={post.content} />
        <PostActions postId={post.id} likes={post.likes} />
    </div>
  )
}

export default PostLists