import React from "react";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div onClick={handleLogout} className="  text-red-500  rounded-md cursor-pointer hover:scale-105 transition-all ease-in 1s">
      <Settings />
    </div>
  );
}

export default LogoutButton;
