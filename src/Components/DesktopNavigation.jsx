import React from "react";
import {
  Search,
  X,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ShoppingCart,
  Bell,
  User,
  Settings,
  LogOut,
  Building,
  Mail,
  Heart,
} from "lucide-react";
import CartDropdown from "./CartDropdown";
import NotificationCenter from "./Notification";

const DesktopNavigation = ({
  isScrolled,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
  handleSearch,
  desktopMenuItems,
  activeLink,
  handleNavItemClick,
  cart,
  goToShop,
  isCartHovered,
  setIsCartHovered,
  notifications,
  notificationCount,
  token,
  setShowLogoutModal,
  isUserDropdownOpen,
  setIsUserDropdownOpen,
  handleUserAction,
  socialLinks,
  searchBarRef,
  onUpdateQty,
  onRemove,
}) => {
  const [isNotifHovered, setIsNotifHovered] = React.useState(false);

  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative" ref={searchBarRef}>
                {!showSearchBar ? (
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-emerald-300 rounded-full hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <Search className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                    <span className="text-sm text-emerald-700 group-hover:text-emerald-800">
                      Search...
                    </span>
                  </button>
                ) : (
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center space-x-2 bg-white border-2 border-emerald-500 rounded-full px-4 py-2 shadow-lg transition-all">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-64 focus:outline-none text-sm text-gray-800 placeholder-emerald-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchBar(false);
                          setSearchQuery("");
                        }}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full border border-emerald-200">
                <span className="text-xs font-medium text-emerald-700 mr-1">
                  Follow:
                </span>
                {socialLinks.map(({ id, icon: Icon, href, color }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 text-emerald-600 ${color} transition-colors rounded-full hover:bg-emerald-100`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
              <div className="h-6 w-px bg-emerald-300" />
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all group"
              >
                <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">+123 456 7890</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`hidden md:block fixed left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "top-12 bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-md shadow-2xl"
            : "top-12 bg-gradient-to-r from-emerald-800 to-teal-800 shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="text-white hover:text-amber-300 transition-colors group p-2 -ml-2"
            >
              <span className="block text-2xl font-extrabold tracking-tight group-hover:text-amber-300 transition-colors">
                Nibras Al-deen
              </span>
              <span className="block text-xs font-medium -mt-1 text-emerald-300 group-hover:text-amber-100 transition-colors">
                A Light of Guidance
              </span>
            </button>

            <div className="flex items-center flex-wrap justify-end space-x-4 lg:space-x-6">
              {desktopMenuItems.map((item) => {
                if (item.dropdown) {
                  const DropdownComponent = item.component;
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      ref={item.ref}
                      onMouseEnter={() => item.setState(true)}
                      onMouseLeave={() => item.setState(false)}
                    >
                      <button
                        onClick={() => {
                          handleNavItemClick(item.href, item.name);
                          item.setState(false);
                        }}
                        className={`flex items-center text-white hover:text-amber-300 transition-colors font-medium relative group p-2 whitespace-nowrap ${
                          item.state || activeLink === item.name
                            ? "text-amber-300"
                            : ""
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            item.state ? "rotate-180" : ""
                          }`}
                        />
                        <div
                          className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                            activeLink === item.name
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </button>

                      {item.state && (
                        <div className="absolute top-full mt-2 right-0 z-50 w-64 rounded-lg shadow-xl bg-white">
                          {DropdownComponent ? (
                            <DropdownComponent
                              onItemClick={(href) => {
                                handleNavItemClick(href, item.name);
                                item.setState(false);
                              }}
                            />
                          ) : (
                            <div className="p-2">
                              {item.items.map((subItem) => (
                                <button
                                  key={subItem.name}
                                  onClick={() => {
                                    handleNavItemClick(
                                      subItem.href,
                                      subItem.name
                                    );
                                    item.setState(false);
                                  }}
                                  className="w-full text-left flex items-center p-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-md transition-colors"
                                >
                                  <subItem.icon className="w-4 h-4 mr-3" />
                                  {subItem.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavItemClick(item.href, item.name)}
                    className={`text-white hover:text-amber-300 transition-colors font-medium relative group p-2 whitespace-nowrap ${
                      activeLink === item.name ? "text-amber-300" : ""
                    }`}
                  >
                    {item.name}
                    <div
                      className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                        activeLink === item.name
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button className="p-2 rounded-full transition-colors relative text-white hover:text-amber-300 hover:bg-emerald-700">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.reduce((s, i) => s + i.quantity, 0) > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-emerald-800">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </button>

                {isCartHovered && (
                  <div className="absolute right-0 mt-6 w-80 z-100">
                    <CartDropdown
                      cart={cart}
                      onClose={() => setIsCartHovered(false)}
                      onViewCart={goToShop}
                      onUpdateQty={onUpdateQty}
                      onRemove={onRemove}
                    />
                  </div>
                )}
              </div>
              <div
                className="relative"
                onMouseEnter={() => setIsNotifHovered(true)}
                onMouseLeave={() => setIsNotifHovered(false)}
              >
                <button className="p-2 rounded-full transition-colors relative text-white hover:text-amber-300 hover:bg-emerald-700">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-emerald-800">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {isNotifHovered && (
                  <div className="absolute right-0 mt-6 w-80 z-100">
                    <NotificationCenter notificationCount={notificationCount} />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className={`p-2 rounded-full transition-colors flex items-center ${
                    isUserDropdownOpen || activeLink === "Mine"
                      ? "bg-amber-300 text-emerald-800"
                      : "text-white hover:text-amber-300 hover:bg-emerald-700"
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-48 rounded-md shadow-lg bg-white z-50">
                    <div className="py-1">
                      {token ? (
                        <>
                          <button
                            onClick={() => handleUserAction("profile")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => handleUserAction("settings")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </button>
                          <div className="border-t border-gray-100" />
                          <button
                            onClick={() => handleUserAction("logout")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavItemClick("/login", "Mine")}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3 transform rotate-180" />
                          Login / Register
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DesktopNavigation;
