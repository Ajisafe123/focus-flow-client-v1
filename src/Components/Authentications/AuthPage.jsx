import React from "react";
import AuthContainer from "./AuthContainer";
import BackToWebsite from "./BackToWebsite";

export default function IslamicAuthPages() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 flex items-center justify-center p-4 relative">
      <div className="relative w-full max-w-md">
        <AuthContainer />
        <BackToWebsite />
      </div>
    </div>
  );
}
