import React, { useState, useEffect } from "react";
import { Navigation, Compass, MapPin } from "lucide-react";

export default function QiblaCompass() {
  const [qiblaData, setQiblaData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const findQibla = () => {
    setIsCalculating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          try {
            const res = await fetch("http://localhost:8000/qibla/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            });
            const data = await res.json();
            setQiblaData(data);
          } catch (err) {
            console.error("Backend fetch error:", err);
            alert("Failed to fetch Qibla direction from backend");
          } finally {
            setIsCalculating(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsCalculating(false);
          alert("Please enable location access to find Qibla direction");
        }
      );
    }
  };

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () =>
        window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  const compassRotation =
    qiblaData !== null ? qiblaData.bearing - deviceHeading : 0;

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <Compass size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Qibla Finder
          </h1>
          <p className="text-slate-500 text-sm">Find the direction to Kaaba</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-200 p-8 mb-6">
          <div className="relative w-full aspect-square max-w-xs mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700">
                N
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">
                S
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                W
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                E
              </div>
            </div>

            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${compassRotation}deg)` }}
            >
              <div className="absolute inset-8 rounded-full overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Kaaba_in_Makkah.jpg"
                  alt="Kaaba"
                  className="w-full h-full object-cover opacity-25"
                />
              </div>

              <div className="absolute inset-0 flex items-start justify-center">
                <div className="w-1 h-1/2 bg-gradient-to-b from-emerald-500 to-transparent rounded-full relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Navigation
                        size={20}
                        className="text-white transform rotate-180"
                        fill="white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-300 rounded-full border-2 border-white shadow-md"></div>
              </div>
            </div>
          </div>

          {qiblaData && (
            <div className="text-center space-y-3">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <p className="text-emerald-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Qibla Direction
                </p>
                <p className="text-3xl font-bold text-emerald-700">
                  {Math.round(qiblaData.bearing)}°
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ~{qiblaData.distance_km} km away
                </p>
              </div>

              {userLocation && (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} />
                  <span>
                    {userLocation.lat.toFixed(4)}°,{" "}
                    {userLocation.lng.toFixed(4)}°
                  </span>
                </div>
              )}
            </div>
          )}

          {!qiblaData && !isCalculating && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Click below to find Qibla direction
              </p>
            </div>
          )}
        </div>

        <button
          onClick={findQibla}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Locating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Compass size={20} />
              {qiblaData ? "Recalculate" : "Find Qibla"}
            </span>
          )}
        </button>

        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-xs text-amber-800 text-center">
            <span className="font-semibold">Note:</span> For best accuracy, hold
            your device flat and away from magnetic interference
          </p>
        </div>
      </div>
    </div>
  );
}
