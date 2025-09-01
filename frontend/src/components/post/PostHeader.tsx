import React from 'react'

function PostHeader() {
  return (
   <div className="flex items-center justify-between my-4 mx-3 ">
    <div className="flex items-center gap-3">
      <img className="w-10 h-10 rounded-full bg-amber-600 border-none" />
      <div>
        <p className="font-semibold">SAMPLE USER</p>
        <p className="text-gray-500 text-sm">10 minutes ago</p>
      </div>
    </div>
  </div>
  )
}

export default PostHeader