import { useState } from "react";
import axios from "axios";
import {
  Code2,
  User,
  Users,
  UserPlus,
  LogOut,
  Compass,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const isActive = (path) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: "Discover", path: "/app", icon: Compass },
    { name: "Connections", path: "/app/connections", icon: Users },
    { name: "Chats", path: "/app/chat", icon: MessageCircle },
    { name: "Requests", path: "/app/requests", icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9E3EC] bg-[#FFFFFF]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Title */}
        <Link to="/app" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D43F6C] text-white shadow-sm group-hover:bg-[#ED488F] transition duration-200">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-[#252525] tracking-wide">
              Dev<span className="text-[#D43F6C]">Connect</span>
            </span>
            <span className="text-[10px] text-[#8A8A8A] font-medium uppercase tracking-wider">
              Developer Network
            </span>
          </div>
        </Link>

        {/* Right side navigation: Discover, Connections, Chats, Requests, Avatar */}
        {user && (
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Navigation Items in single horizontal row */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition duration-200 ${
                      active
                        ? "bg-[#F7E8F0] text-[#D43F6C] shadow-xs"
                        : "text-[#666666] hover:bg-[#F7F4FE] hover:text-[#252525]"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        active ? "text-[#D43F6C]" : "text-[#8A8A8A]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile Avatar (Far Right) */}
            <div className="relative ml-1">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center rounded-full p-0.5 border border-[#E9E3EC] bg-[#FFFFFF] hover:border-[#D43F6C] focus:outline-none transition duration-200 cursor-pointer"
                aria-label="User menu"
              >
                <img
                  src={
                    user?.photoUrl ||
                    "https://dummyimage.com/100x100/cccccc/000000&text=User"
                  }
                  alt={`${user?.firstname || "User"}'s avatar`}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {/* Profile Dropdown */}
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2.5 w-56 overflow-hidden rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-lg z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-[#E9E3EC] bg-[#FAF5FB]">
                      <p className="text-sm font-bold text-[#252525] truncate">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-xs text-[#8A8A8A] truncate mt-0.5">
                        {user?.email || "Developer"}
                      </p>
                    </div>

                    <div className="p-1.5">
                      <Link
                        to="/app/profile"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#252525] hover:bg-[#FAF5FB] hover:text-[#D43F6C] transition duration-150"
                      >
                        <User className="h-4 w-4 text-[#8A8A8A]" />
                        Profile Settings
                      </Link>

                      <div className="my-1 border-t border-[#E9E3EC]"></div>

                      <button
                        onClick={() => {
                          setOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition duration-150 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Secondary Row: Navigation Items (Clean responsive pills) */}
      {user && (
        <div className="md:hidden border-t border-[#E9E3EC] bg-[#FFFFFF] px-3 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-around gap-1 min-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 ${
                    active
                      ? "bg-[#F7E8F0] text-[#D43F6C]"
                      : "text-[#666666] hover:bg-[#F7F4FE] hover:text-[#252525]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-[#D43F6C]" : "text-[#8A8A8A]"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;