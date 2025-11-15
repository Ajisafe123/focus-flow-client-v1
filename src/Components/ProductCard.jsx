import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Truck,
  CreditCard,
  Tag,
} from "lucide-react";

export const PRODUCT_CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "books", name: "Islamic Books" },
  { id: "prayer", name: "Prayer Items" },
  { id: "decor", name: "Home Decor" },
  { id: "gifts", name: "Gift Sets" },
];

export const WHY_SHOP_WITH_US = [
  {
    icon: Shield,
    title: "Authentic",
    description: "All products are verified and ethically sourced.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free on orders over $50.",
  },
  {
    icon: CreditCard,
    title: "Secure Pay",
    description: "100% secure checkout.",
  },
  { icon: Tag, title: "Best Prices", description: "Competitive pricing." },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "The Noble Quran - English Translation",
    category: "books",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
    description:
      "Beautiful hardcover Quran with English translation and tafsir",
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Premium Prayer Mat - Velvet",
    category: "prayer",
    price: 34.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400",
    description: "Soft velvet prayer mat with compass and carry bag",
    inStock: true,
    badge: "New",
  },
  {
    id: 3,
    name: "Hadith Collection - 40 Hadith Nawawi",
    category: "books",
    price: 19.99,
    originalPrice: 24.99,
    rating: 5.0,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    description: "Complete collection with Arabic text and English translation",
    inStock: true,
    badge: null,
  },
  {
    id: 4,
    name: "Islamic Wall Art - Ayatul Kursi",
    category: "decor",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400",
    description: "Elegant canvas print with gold Arabic calligraphy",
    inStock: true,
    badge: "Sale",
  },
  {
    id: 5,
    name: "Tasbih Prayer Beads - 99 Beads",
    category: "prayer",
    price: 14.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400",
    description: "Handcrafted wooden prayer beads with counter",
    inStock: true,
    badge: null,
  },
  {
    id: 6,
    name: "Islamic Gift Set - Ramadan Collection",
    category: "gifts",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400",
    description: "Complete gift set with Quran, prayer mat, and dates",
    inStock: true,
    badge: "Limited",
  },
  {
    id: 7,
    name: "Pocket Dua Book",
    category: "books",
    price: 9.99,
    originalPrice: null,
    rating: 4.5,
    reviews: 423,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400",
    description: "Compact book of daily duas with transliteration",
    inStock: true,
    badge: null,
  },
  {
    id: 8,
    name: "Qibla Compass - Digital",
    category: "prayer",
    price: 24.99,
    originalPrice: null,
    rating: 4.4,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400",
    description: "Accurate digital compass with prayer times",
    inStock: false,
    badge: null,
  },
];

export const CartSidebar = ({
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-xs md:max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 translate-x-0">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 md:p-6 flex items-center justify-between border-b-4 border-teal-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Your Cart</h2>
              <p className="text-emerald-100 text-xs md:text-sm">
                {cart.length} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-sm">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-3 flex gap-3 shadow-sm border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-0 line-clamp-1 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-emerald-600 font-bold mb-1 text-xs">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-semibold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 self-start hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-2 mb-3 text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-600">Shipping:</span>
                <span
                  className={`font-semibold ${
                    shipping === 0 ? "text-emerald-600" : ""
                  }`}
                >
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-1.5 rounded-lg text-center font-medium">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                <span>Total:</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const WhyShopAccordion = ({ whyShopData }) => {
  const [isWhyShopOpen, setIsWhyShopOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-xl">
      <button
        onClick={() => setIsWhyShopOpen(!isWhyShopOpen)}
        className="w-full flex justify-between items-center text-left py-1"
      >
        <h3 className="text-xl font-bold">Why Shop With Us?</h3>
        {isWhyShopOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isWhyShopOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/50">
          {whyShopData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-3 text-center"
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-emerald-100" />
                <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                <p className="text-xs text-emerald-100 hidden md:block">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {product.badge && (
            <div
              className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                product.badge === "Sale"
                  ? "bg-red-600"
                  : product.badge === "New"
                  ? "bg-emerald-600"
                  : product.badge === "Bestseller"
                  ? "bg-amber-600"
                  : "bg-blue-600"
              }`}
            >
              {product.badge}
            </div>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-md hover:scale-110 transition-transform text-gray-700 hover:text-red-500"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-2xl">
              OOS
            </span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-extrabold text-emerald-600">
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-bold text-red-500 ml-1">
                -{discount}%
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-2 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-1 text-sm ${
            product.inStock
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 active:scale-[.98]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};
