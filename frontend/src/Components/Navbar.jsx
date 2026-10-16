import { useState } from "react";
import axios from "axios";
import { Code2, User, Users, UserPlus, LogOut, Compass } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9E3EC] bg-[#FFFFFF]/95 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-6 md:px-10">

        {/* Left Side: Logo */}
        <Link to="/app" className="flex items-center gap-2.5 group">
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

        {/* Center: Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/app"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                isActive("/app")
                  ? "bg-[#F7E8F0] text-[#D43F6C]"
                  : "text-[#666666] hover:bg-[#F7F4FE] hover:text-[#252525]"
              }`}
            >
              <Compass className="h-4 w-4" />
              Discover
            </Link>

            <Link
              to="/app/connections"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                isActive("/app/connections")
                  ? "bg-[#F7E8F0] text-[#D43F6C]"
                  : "text-[#666666] hover:bg-[#F7F4FE] hover:text-[#252525]"
              }`}
            >
              <Users className="h-4 w-4" />
              Connections
            </Link>

            <Link
              to="/app/requests"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                isActive("/app/requests")
                  ? "bg-[#F7E8F0] text-[#D43F6C]"
                  : "text-[#666666] hover:bg-[#F7F4FE] hover:text-[#252525]"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Requests
            </Link>
          </nav>
        )}

        {/* Right Side: Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-1 rounded-full border border-[#E9E3EC] bg-[#FFFFFF] hover:border-[#D43F6C] focus:outline-none transition duration-200"
            >
              <img
                src={user?.photoUrl || "https://dummyimage.com/100x100/cccccc/000000&text=User"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                
                <div className="absolute right-0 mt-2.5 w-52 overflow-hidden rounded-xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-lg z-20">
                  <div className="p-1">
                    <Link
                      to="/app/profile"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#252525] hover:bg-[#FAF5FB] hover:text-[#D43F6C] transition duration-150"
                    >
                      <User className="h-4 w-4 text-[#8A8A8A]" />
                      Profile Settings
                    </Link>

                    {/* Mobile Navigation in Dropdown */}
                    <div className="md:hidden border-t border-[#E9E3EC] mt-1 pt-1">
                      <Link
                        to="/app"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#252525] hover:bg-[#FAF5FB] hover:text-[#D43F6C] transition duration-150"
                      >
                        <Compass className="h-4 w-4 text-[#8A8A8A]" />
                        Discover
                      </Link>

                      <Link
                        to="/app/connections"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#252525] hover:bg-[#FAF5FB] hover:text-[#D43F6C] transition duration-150"
                      >
                        <Users className="h-4 w-4 text-[#8A8A8A]" />
                        Connections
                      </Link>

                      <Link
                        to="/app/requests"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#252525] hover:bg-[#FAF5FB] hover:text-[#D43F6C] transition duration-150"
                      >
                        <UserPlus className="h-4 w-4 text-[#8A8A8A]" />
                        Requests
                      </Link>
                    </div>

                    <div className="my-1 border-t border-[#E9E3EC]"></div>

                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition duration-150 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;