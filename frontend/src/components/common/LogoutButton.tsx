import React from "react";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const controller = new AbortController()
    await logout(controller.signal);
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white p-2 rounded-md cursor-pointer hover:scale-105 transition-all ease-in 1s">
      Logout
    </button>
  );
}

export default LogoutButton;
