import React from "react";

function FeedLayout({ children } : any) {
  return (
    <div className="flex h-screen  text-gray-800">
      <div className="flex flex-col flex-auto h-full p-6">
        <div className="flex flex-col flex-auto flex-shrink-0 overflow-y-auto rounded-2xl bg-gray-100 h-full p-4">
        { children }
      </div>
    </div>
  </div>
  );
}

export default FeedLayout;
