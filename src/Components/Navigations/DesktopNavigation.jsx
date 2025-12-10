import React from "react";
import {
  Search,
  X,
  Phone,
  ChevronDown,
  ShoppingCart,
  Bell,
  User,
  Settings,
  LogOut,
  Globe,
  ChevronRight,
} from "lucide-react";
import CartDropdown from "./NavtigationDropDownCard/CartDropdown";
import NotificationCenter from "../../Users/Notification";

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
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isNotifHovered, setIsNotifHovered] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const hoverTimers = React.useRef({});

  const languages = [
    { code: "en", name: "English", flag: "GB" },
    { code: "ar", name: "العربية", flag: "SA" },
    { code: "ur", name: "اردو", flag: "PK" },
    { code: "bn", name: "বাংলা", flag: "BD" },
    { code: "id", name: "Bahasa Indonesia", flag: "ID" },
    { code: "ms", name: "Bahasa Melayu", flag: "MY" },
    { code: "tr", name: "Türkçe", flag: "TR" },
    { code: "fr", name: "Français", flag: "FR" },
    { code: "ha", name: "Hausa", flag: "NG" },
  ];
  const activeLanguage =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];
  const flagEmoji = (countryCode) =>
    countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

  React.useEffect(
    () => () => {
      Object.values(hoverTimers.current).forEach((id) => clearTimeout(id));
    },
    []
  );

  const handleDropdownEnter = (key, setter) => {
    if (hoverTimers.current[key]) clearTimeout(hoverTimers.current[key]);
    setter(true);
  };
  const handleDropdownLeave = (key, setter) => {
    hoverTimers.current[key] = setTimeout(() => setter(false), 160);
  };

  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative" ref={searchBarRef}>
                {!showSearchBar ? (
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full hover:border-emerald-500 hover:shadow-md transition-all group text-xs"
                  >
                    <Search className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-700" />
                    <span className="text-emerald-700 group-hover:text-emerald-800">
                      Search...
                    </span>
                  </button>
                ) : (
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center space-x-1.5 bg-white border-2 border-emerald-500 rounded-full px-3 py-1.5 shadow-lg transition-all">
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-40 sm:w-56 focus:outline-none text-xs text-gray-800 placeholder-emerald-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                      >
                        <Search className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchBar(false);
                          setSearchQuery("");
                        }}
                        className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-white rounded-full border border-emerald-200">
                <span className="font-medium text-emerald-700">Follow:</span>
                {socialLinks.map(({ id, icon: Icon, href, color }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1 text-emerald-600 ${color} transition-colors rounded-full hover:bg-emerald-100`}
                  >
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
              <div className="h-5 w-px bg-emerald-300" />
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all group"
              >
                <Phone className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">+123 456 7890</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`hidden md:block fixed left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? "top-12 bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-md shadow-2xl"
          : "top-12 bg-gradient-to-r from-emerald-800 to-teal-800 shadow-xl"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="text-white hover:text-amber-300 transition-colors group p-1.5 -ml-1.5"
            >
              <span className="block text-xl font-extrabold tracking-tight group-hover:text-amber-300 transition-colors">
                Nibras Al-deen
              </span>
              <span className="block text-xs font-medium -mt-0.5 text-emerald-300 group-hover:text-amber-100 transition-colors">
                A Light of Guidance
              </span>
            </button>

            <div className="hidden lg:flex items-center space-x-1.5">
              {desktopMenuItems.map((item) => {
                const isBold = ["Home", "Quran", "Dhikr & Du'a"].includes(
                  item.name
                );
                const isDropdown = item.dropdown;

                if (isDropdown) {
                  const DropdownComponent = item.component;
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      ref={item.ref}
                      onMouseEnter={() =>
                        handleDropdownEnter(item.name, item.setState)
                      }
                      onMouseLeave={() =>
                        handleDropdownLeave(item.name, item.setState)
                      }
                    >
                      <button
                        onClick={() => {
                          handleNavItemClick(item.href, item.name);
                          item.setState(false);
                        }}
                        className={`flex items-center text-white hover:text-amber-300 transition-colors relative group px-2 py-1 text-sm whitespace-nowrap ${isBold ? "font-bold" : "font-medium"
                          } ${item.state || activeLink === item.name
                            ? "text-amber-300"
                            : ""
                          }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${item.state ? "rotate-180" : ""
                            }`}
                        />
                        <div
                          className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${activeLink === item.name
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                            }`}
                        />
                      </button>

                      {item.state && (
                        <div
                          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-[100]"
                          onMouseEnter={() =>
                            handleDropdownEnter(item.name, item.setState)
                          }
                          onMouseLeave={() =>
                            handleDropdownLeave(item.name, item.setState)
                          }
                        >
                          {DropdownComponent ? (
                            <DropdownComponent
                              onItemClick={(href) => {
                                handleNavItemClick(href, item.name);
                                item.setState(false);
                              }}
                            />
                          ) : (
                            <div className="w-64 rounded-2xl shadow-xl bg-white border border-emerald-100 ring-1 ring-black/5 overflow-hidden p-2">
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
                                  className="w-full text-left flex items-center p-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all font-medium group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center mr-3 group-hover:bg-emerald-200/50 transition-colors">
                                    <subItem.icon className="w-4 h-4 text-emerald-600" />
                                  </div>
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
                    className={`text-white hover:text-amber-300 transition-colors relative group px-2 py-1 text-sm whitespace-nowrap ${isBold ? "font-bold" : "font-medium"
                      } ${activeLink === item.name ? "text-amber-300" : ""}`}
                  >
                    {item.name}
                    <div
                      className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${activeLink === item.name
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-1.5">
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                  className={`flex items-center px-2 py-1 text-sm font-medium text-white hover:text-amber-300 transition-colors ${isLangDropdownOpen ? "text-amber-300" : ""
                    }`}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  {flagEmoji(activeLanguage.flag)} {activeLanguage.code.toUpperCase()}
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 w-56 rounded-2xl shadow-xl bg-white border border-emerald-100 ring-1 ring-black/5 overflow-hidden">
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
                        >
                          <span className="mr-3 text-lg">
                            {flagEmoji(lang.flag)}
                          </span>
                          <span className="font-medium">{lang.name}</span>
                          {lang.code === activeLanguage.code && (
                            <span className="ml-auto text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button className="p-1.5 rounded-full transition-colors relative text-white hover:text-amber-300 hover:bg-emerald-700">
                  <ShoppingCart className="w-4.5 h-4.5" />
                  {cart.reduce((s, i) => s + i.quantity, 0) > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-3.5 w-3.5 text-xs font-bold text-white bg-red-500 rounded-full border border-emerald-800">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </button>

                {isCartHovered && (
                  <div className="absolute right-0 mt-2 w-80 z-100">
                    <div className="rounded-2xl shadow-xl bg-white border border-emerald-100 ring-1 ring-black/5 overflow-hidden">
                      <CartDropdown
                        cart={cart}
                        onClose={() => setIsCartHovered(false)}
                        onViewCart={goToShop}
                        onUpdateQty={onUpdateQty}
                        onRemove={onRemove}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setIsNotifHovered(true)}
                onMouseLeave={() => setIsNotifHovered(false)}
              >
                <button className="p-1.5 rounded-full transition-colors relative text-white hover:text-amber-300 hover:bg-emerald-700">
                  <Bell className="w-4.5 h-4.5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-3.5 w-3.5 text-xs font-bold text-white bg-red-500 rounded-full border border-emerald-800">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {isNotifHovered && (
                  <div className="absolute right-0 mt-2 w-80 z-100">
                    <div className="rounded-2xl shadow-xl bg-white border border-emerald-100 ring-1 ring-black/5 overflow-hidden">
                      <NotificationCenter notificationCount={notificationCount} />
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimers.current["user"]) clearTimeout(hoverTimers.current["user"]);
                  setIsUserDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  hoverTimers.current["user"] = setTimeout(() => setIsUserDropdownOpen(false), 300);
                }}
              >
                <button
                  onClick={() => handleUserAction(token ? "profile" : "login")}
                  className={`p-1.5 rounded-full transition-colors ${isUserDropdownOpen || activeLink === "Mine"
                    ? "bg-amber-300 text-emerald-800"
                    : "text-white hover:text-amber-300 hover:bg-emerald-700"
                    }`}
                >
                  <User className="w-4.5 h-4.5" />
                </button>
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white border border-emerald-100 ring-1 ring-black/5 z-50 overflow-hidden pointer-events-auto"
                    onMouseEnter={() => {
                      if (hoverTimers.current["user"]) clearTimeout(hoverTimers.current["user"]);
                    }}
                    onMouseLeave={() => {
                      hoverTimers.current["user"] = setTimeout(() => setIsUserDropdownOpen(false), 300);
                    }}
                  >
                    <div className="bg-white p-3">
                      <div className="space-y-1">
                        {token ? (
                          <>
                            <button
                              onClick={() => handleUserAction("profile")}
                              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all rounded-lg font-medium group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <User className="w-4 h-4 text-emerald-700" />
                              </div>
                              <span className="flex-1">Profile</span>
                              <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button
                              onClick={() => handleUserAction("settings")}
                              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all rounded-lg font-medium group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <Settings className="w-4 h-4 text-emerald-700" />
                              </div>
                              <span className="flex-1">Settings</span>
                              <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => handleUserAction("logout")}
                              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all rounded-lg font-medium group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="flex-1">Logout</span>
                            </button>
                          </>
                        ) : (
                          <div className="p-1">
                            <div className="text-center mb-3">
                              <h3 className="text-sm font-bold text-gray-800">Welcome to Nibras</h3>
                              <p className="text-xs text-gray-500 mt-0.5">Please sign in to continue</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleNavItemClick("/login", "Mine")}
                                className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                              >
                                Login
                              </button>
                              <button
                                onClick={() => handleNavItemClick("/register", "Mine")}
                                className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                              >
                                Sign Up
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
