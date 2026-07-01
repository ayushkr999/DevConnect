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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-6 md:px-10">

        {/* Left Side: Logo */}
        <Link to="/app" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10 group-hover:bg-indigo-500 transition duration-200">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-white tracking-wide">
              Dev<span className="text-indigo-400">Connect</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
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
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Compass className="h-4 w-4" />
              Discover
            </Link>

            <Link
              to="/app/connections"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                isActive("/app/connections")
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Connections
            </Link>

            <Link
              to="/app/requests"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                isActive("/app/requests")
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
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
              className="flex items-center gap-2 p-1 rounded-full border border-slate-700 bg-slate-800 hover:border-slate-600 focus:outline-none transition duration-200"
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
                
                <div className="absolute right-0 mt-2.5 w-52 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl z-20">
                  <div className="p-1">
                    <Link
                      to="/app/profile"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Profile Settings
                    </Link>

                    {/* Mobile Navigation in Dropdown */}
                    <div className="md:hidden border-t border-slate-800/50 mt-1 pt-1">
                      <Link
                        to="/app"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150"
                      >
                        <Compass className="h-4 w-4 text-slate-400" />
                        Discover
                      </Link>

                      <Link
                        to="/app/connections"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150"
                      >
                        <Users className="h-4 w-4 text-slate-400" />
                        Connections
                      </Link>

                      <Link
                        to="/app/requests"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150"
                      >
                        <UserPlus className="h-4 w-4 text-slate-400" />
                        Requests
                      </Link>
                    </div>

                    <div className="my-1 border-t border-slate-800"></div>

                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition duration-150"
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