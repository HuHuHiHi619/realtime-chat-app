import React, { useState } from "react";
import ActionButton from "../common/ActionButton";
import { useUiStore } from "@/store/useUiStore";
import { Radio, Camera, Target } from "lucide-react";

function PostInput() {
  const { togglePostInputOpen } = useUiStore();

  return (
    <div className="bg-white shadow-md border border-gray-300 rounded-2xl">
      <div className="py-3 mx-3 flex gap-3 border-b border-b-gray-300 items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex-shrink-0 shadow-sm ring-2 ring-white ring-offset-1"></div>
        <span
          onClick={togglePostInputOpen}
          className="border border-gray-200 rounded-3xl w-full p-2 pl-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-brandChoco-50 hover:text-brandChoco-50 shadow-sm hover:shadow-md hover:border-gray-300"
        >
          What's on your mind
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-2 mx-3">
        <ActionButton
          icon={Radio}
          text="LIVE"
          className="hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
          iconClassName="w-5 h-5 text-red-600"
          textClassName="text-sm  text-gray-700"
        />

        <ActionButton
          icon={Camera}
          text="PHOTO"
          className="hover:bg-red-50 hover:text-green-600 border border-transparent hover:border-green-200"
          iconClassName="w-5 h-5 text-emerald-600"
          textClassName="text-sm  text-gray-700"
        />
        <ActionButton
          icon={Target}
          text="ACTIVITIES"
          className="hover:bg-red-50 hover:text-blue-600 border border-transparent hover:border-blue-200"
          iconClassName="w-5 h-5 text-blue-600"
          textClassName="text-sm  text-gray-700"
        />
      </div>
    </div>
  );
}

export default PostInput;
