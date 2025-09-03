import React from 'react'
import ActionButton from '../common/ActionButton'

function PostActions({ postId , likes , comments} : any) {
  return (
    <div className="mx-4 ">
    {/* Stats */}
    <div className="border-b pb-2 flex justify-between text-gray-500 text-sm ">
      { likes && <span>{likes} likes</span>}
      { comments && <span>{comments} comments</span>}
    </div>
    
    {/* Action buttons */}
    <div className="grid grid-cols-3 gap-2 my-2">
      <ActionButton icon="👍" text="Like" />
      <ActionButton icon="💬" text="Comment" />
      <ActionButton icon="📤" text="Share" />
    </div>
  </div>
  )
}

export default PostActions