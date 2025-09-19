import React from "react";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div onClick={handleLogout} className="flex justify-center text-white text-xl shadow-inner bg-red-500 w-full p-2 rounded-md cursor-pointer hover:scale-105 transition-all ease-in 1s">
      LOGOUT
    </div>
  );
}

export default LogoutButton;
