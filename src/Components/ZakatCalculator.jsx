import React, { useState, useEffect } from "react";
import { Gift, History, Trash2, Calculator, TrendingUp } from "lucide-react";

export default function ZakatCalculator() {
  const [amount, setAmount] = useState("");
  const [zakat, setZakat] = useState(null);
  const [type, setType] = useState("cash");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_BASE = "https://focus-flow-server-v1.onrender.com/zakat";
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch {
      setMessage("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const calculateZakat = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assets_total: val,
          savings: 0,
          note: `${type} zakat`,
          name: "Auto calc",
          gold_price_per_gram: null,
          type: type,
        }),
      });

      const data = await res.json();
      setZakat(parseFloat(data.zakat_due));
      setMessage("Zakat calculated successfully!");
      fetchHistory();
    } catch {
      setMessage("Calculation failed.");
    }
  };

  const deleteRecord = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(history.filter((h) => h.id !== id));
    } catch {
      setMessage("Failed to delete record.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-emerald-600 text-sm">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-6 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Zakat Calculator
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                  Calculate your zakat obligation
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Asset Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="cash">Cash</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="business">Business Assets</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Total Wealth (₦)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={calculateZakat}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Calculator size={18} />
              Calculate Zakat
            </button>

            {zakat !== null && (
              <div className="mt-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Zakat Due
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₦{zakat.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  2.5% of your total eligible wealth
                </p>
              </div>
            )}

            {message && (
              <div
                className={`mt-4 px-4 py-2.5 rounded-lg text-xs ${
                  message.includes("success")
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-gray-800 mb-3">
              <History size={18} className="text-emerald-600" />
              <h4 className="font-bold text-sm">Recent Calculations</h4>
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                            {h.type
                              ? h.type.charAt(0).toUpperCase() + h.type.slice(1)
                              : "Cash"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-700">
                              Wealth:
                            </span>
                            <span>
                              ₦{Number(h.assets_total || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-700">
                              Zakat:
                            </span>
                            <span className="text-emerald-600 font-semibold">
                              ₦{Number(h.zakat_amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRecord(h.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <History size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No calculations yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Start by calculating your zakat above
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Zakat is calculated at 2.5% of your total eligible wealth
          </p>
        </div>
      </div>
    </div>
  );
}
