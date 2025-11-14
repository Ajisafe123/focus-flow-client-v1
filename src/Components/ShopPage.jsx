import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  Filter,
  Package,
  Truck,
  Shield,
  CreditCard,
  Tag,
  BookOpen,
  Home,
  Gift,
  Sparkles,
  Check,
} from "lucide-react";

const PRODUCT_CATEGORIES = [
  { id: "all", name: "All Products", icon: Package },
  { id: "books", name: "Islamic Books", icon: BookOpen },
  { id: "prayer", name: "Prayer Items", icon: Home },
  { id: "decor", name: "Home Decor", icon: Sparkles },
  { id: "gifts", name: "Gift Sets", icon: Gift },
];

const PRODUCTS = [
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
  {
    id: 9,
    name: "Islamic Calligraphy Set",
    category: "decor",
    price: 89.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400",
    description: "Set of 3 framed calligraphy pieces for home",
    inStock: true,
    badge: "Premium",
  },
];

const ProductCard = ({
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
              product.badge === "Sale"
                ? "bg-red-500"
                : product.badge === "New"
                ? "bg-emerald-500"
                : product.badge === "Bestseller"
                ? "bg-amber-500"
                : product.badge === "Limited"
                ? "bg-purple-500"
                : "bg-blue-500"
            }`}
          >
            {product.badge}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          style={{ right: discount > 0 ? "60px" : "12px" }}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews} reviews)
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
            product.inStock
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

const CartSidebar = ({
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

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <p className="text-emerald-100 text-sm">{cart.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-emerald-600 font-bold mb-2">
                      ${item.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
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
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Proceed to Checkout
            </button>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IslamicShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleCheckout = () => {
    alert(`Proceeding to checkout with ${cart.length} items!`);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 border-b-4 border-emerald-700 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Islamic Shop
                </h1>
                <p className="text-emerald-100 text-sm">
                  Quality products for your faith journey
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all flex items-center gap-2 border-2 border-white"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="font-semibold">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? "transform scale-105" : ""
            }`}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Islamic products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-lg transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          {PRODUCT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No products found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.has(product.id)}
                />
              ))}
            </div>
          </>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">Why Shop With Us?</h3>
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Shield className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Authentic Products</h4>
              <p className="text-sm text-emerald-100">
                Verified Islamic products
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Truck className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Fast Shipping</h4>
              <p className="text-sm text-emerald-100">
                Free on orders over $50
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <CreditCard className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Secure Payment</h4>
              <p className="text-sm text-emerald-100">100% secure checkout</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Tag className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Best Prices</h4>
              <p className="text-sm text-emerald-100">Competitive pricing</p>
            </div>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      )}

      <footer className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-light mb-2">
            Quality Islamic products delivered to your doorstep
          </p>
          <p className="text-sm text-emerald-100">
            بَارَكَ اللَّهُ فِيكُمْ - May Allah bless you
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IslamicShopPage;
