import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";

import { BASE_URL } from "../utils/constant";
import { addUser } from "../utils/userSlice";

export default function Body() {
  const userData = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.user));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }

      console.error(err);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[150px]" />

        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[170px]" />

        <div className="absolute bottom-0 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[180px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-8 md:px-8 lg:px-12">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}