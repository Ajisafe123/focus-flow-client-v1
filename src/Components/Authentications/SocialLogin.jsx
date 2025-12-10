import React, { useState } from "react";

export default function SocialLogin() {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const openOAuthPopup = (url, provider) => {
    setLoadingProvider(provider);
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      url,
      `${provider}-login`,
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        setLoadingProvider(null);
      }
      try {
        const urlParams = new URLSearchParams(
          popup.location.search || popup.location.hash
        );
        const token = urlParams.get("token");
        if (token) {
          localStorage.setItem("jwt_token", token);
          popup.close();
          clearInterval(timer);
          setLoadingProvider(null);
          window.location.href = "/"; // redirect after login
        }
      } catch (err) {
        // cross-origin: ignore until redirected to our frontend
      }
    }, 500);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() =>
          openOAuthPopup("http://localhost:8000/auth/login/google", "google")
        }
        disabled={loadingProvider !== null}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loadingProvider === "google" ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        ) : (
          <>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-semibold text-slate-700">Google</span>
          </>
        )}
      </button>

      <button
        onClick={() =>
          openOAuthPopup(
            "http://localhost:8000/auth/login/facebook",
            "facebook"
          )
        }
        disabled={loadingProvider !== null}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-white"
      >
        {loadingProvider === "facebook" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.469h3.047v-2.64c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.51c-1.491 0-1.956.925-1.956 1.874v2.247h3.328l-.532 3.469h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
            </svg>
            <span className="text-sm font-semibold">Facebook</span>
          </>
        )}
      </button>
    </div>
  );
}
