import React from 'react'
import ActionButton from '../common/ActionButton'

function PostActions() {
  return (
    <div className="mx-4 ">
    {/* Stats */}
    <div className="border-b pb-2 flex justify-between text-gray-500 text-sm ">
      <span>4 likes</span>
      <span>1 comment</span>
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