import React, { useState } from "react";
import ActionButton from "../common/ActionButton";
import { useUiStore } from "@/store/useUiStore";

function PostInput() {

  const { togglePostInputOpen } = useUiStore()

  return (
    <div>
      <div className="py-3  mx-3 flex gap-3 border-b items-center">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex-shrink-0"></div>
        <span onClick={togglePostInputOpen} className="border-1 rounded-3xl w-full p-2">
          What's on your mind
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-2 mx-3">
        <ActionButton icon="📱" text="LIVE" />
        <ActionButton icon="📸" text="Photo" />
        <ActionButton icon="🎯" text="ACTIVITIES" />
      </div>
    </div>
  );
}

export default PostInput;
