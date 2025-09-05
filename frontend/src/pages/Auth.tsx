import React from "react";
import AuthForm from "../components/auth/AuthForm";
import SnowFall from "@/components/common/SnowFall";

function Auth() {
  return (
    <>
      <SnowFall intervalMs={260} zIndex={-1}/>
      <AuthForm />
    </>
  );
}

export default Auth;
