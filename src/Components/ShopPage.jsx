import React, { useState } from "react";
import { ShoppingCart, Search, Package, ChevronDown } from "lucide-react";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  WHY_SHOP_WITH_US,
  ProductCard,
  CartSidebar,
  WhyShopAccordion,
} from "./ProductCard.jsx";
import { CheckoutPage, OrderSuccess } from "./Checkpage.jsx";

const IslamicShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

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
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setIsCheckoutOpen(false);
    setIsOrderSuccessful(true);
  };

  const handleContinueShopping = () => {
    setIsOrderSuccessful(false);
    setCart([]);
  };

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const currentCategory =
    PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    PRODUCT_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-white" />
              <h1 className="text-xl font-extrabold tracking-tight">
                Islamic Shop
              </h1>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 font-semibold text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold leading-none">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-2 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none transition-all shadow-sm text-sm"
              />
            </div>
            <div className="relative w-full sm:w-40">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {currentCategory.name}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredProducts.length} items)
            </span>
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm mx-auto">
              <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-bold mb-2">
                No products found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
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
        )}

        <WhyShopAccordion whyShopData={WHY_SHOP_WITH_US} />
      </main>

      {isCartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutPage
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleOrderComplete}
          onBackToCart={handleBackToCart}
        />
      )}

      {isOrderSuccessful && (
        <OrderSuccess cart={cart} onContinueShopping={handleContinueShopping} />
      )}

      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-light mb-1">
            Quality Islamic products delivered to your doorstep
          </p>
          <p className="text-xs text-gray-400">
            بَارَكَ اللَّهُ فِيكُمْ - May Allah bless you
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IslamicShopPage;
