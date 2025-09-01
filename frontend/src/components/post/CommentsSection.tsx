import React from 'react'
import ActionButton from '../common/ActionButton'

function CommentsSection() {
  return (
    <div>
        <img src="" alt="" />
        <div>
            <span>SAMPLE USER</span>
            <span>COMMENTS</span>
        </div>
        <span>44 minutes</span>
        <ActionButton icon='👍' text='like' />
        <ActionButton icon='💬' text='reply' />
    </div>
  )
}

export default CommentsSection