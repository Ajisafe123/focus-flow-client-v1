import React from "react";
import { ShoppingCart, X, Trash2, Minus, Plus } from "lucide-react";

export default function CartDropdown({
  cart,
  onClose,
  onViewCart,
  onUpdateQty,
  onRemove,
}) {
  const total = Number(
    cart.reduce((s, i) => s + i.price * i.quantity, 0)
  ).toFixed(2);
  const items = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="w-80 p-4 h-50 bg-white border border-emerald-100 rounded-md shadow-2xl z-50 animate-fadeIn absolute right-0 mt-2">
      <style>{`.animate-fadeIn{animation:fadeIn .3s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          Cart ({items})
        </h4>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close Cart"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={onViewCart}
            className="w-full px-3 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md shadow-md hover:bg-emerald-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="max-h-56 overflow-y-auto space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Subtotal ({items} items):
              </span>
              <span className="text-lg font-bold text-gray-900">${total}</span>
            </div>

            <button
              onClick={onViewCart}
              className="w-full px-4 py-2 text-base font-bold bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors tracking-wide"
            >
              Checkout Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
