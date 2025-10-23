import React, { useState } from "react";
import AuthForm from "./AuthForm";

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className=" bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
      <div className="flex bg-gradient-to-r from-emerald-600 to-teal-600">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-4 text-center font-semibold transition-all ${
            isLogin
              ? "bg-white text-emerald-600"
              : "text-white hover:bg-white/10"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-4 text-center font-semibold transition-all ${
            !isLogin
              ? "bg-white text-emerald-600"
              : "text-white hover:bg-white/10"
          }`}
        >
          Register
        </button>
      </div>

      <div className="p-8">
        <AuthForm isLogin={isLogin} />
      </div>
    </div>
  );
}
