import { useUiStore } from "@/store";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CircleXIcon } from "lucide-react";

export default function ConfirmDialog() {
  const { confirm, toggleConfirmOpen } = useUiStore();

  
  useEffect(() => {
      const modal = document.getElementById("confirm-modal");
      if (modal) {
          if (confirm.isOpen) {
              modal.classList.add("show");
            } else {
                modal.classList.remove("show");
            }
        }
        return () => {
            if (modal) {
                modal.classList.remove("show");
            }
        };
    }, [confirm.isOpen, toggleConfirmOpen]);
    
    if (!confirm.isOpen || !confirm.options) return null;

    const { title, description, confirmText, cancelText, onConfirm } =
    confirm.options;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-brandCream-50 p-6 rounded-2xl shadow-lg ">
        <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-gray-900 ">
          {title}
        </h2>
         <CircleXIcon
          onClick={() => toggleConfirmOpen()}
          className="text-2xl text-[#cd853f] hover:text-[#ff6b6b] w-9 h-9 rounded-full cursor-pointer transition-colors duration-200 hover:bg-[#fff0e6] p-1"
        />
        </div>
        <p className="mt-2 text-xl">
          {description}
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => toggleConfirmOpen()} // ปิด
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {cancelText ?? "Cancel"}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              toggleConfirmOpen(); // ปิดหลัง confirm
            }}
            className="px-4 py-2 rounded-xl shadow-inner bg-red-500 text-white hover:bg-red-700 cursor-pointer"
          >
            {confirmText ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal")!
  );
}
