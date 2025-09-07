import { usePostStore, useUiStore } from "@/store";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

function PostModal() {
 
  return createPortal(
    <div>
      <p className="text-brandChoco-50"></p>
      <button
      
        className="bg-blue-500 p-2 rounded-2xl text-white cursor-pointer hover:bg-blue-600 "
      >
        close
      </button>
    </div>,
    document.getElementById("modal")!
  );
}

export default PostModal;
