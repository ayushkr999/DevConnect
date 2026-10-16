import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { Code2, Compass, MessageSquare, Sparkles, AlertCircle } from "lucide-react";

const AuthPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(location.pathname !== "/signup");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoginForm(location.pathname !== "/signup");
    setError("");
  }, [location.pathname]);

  // Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/signup",
        {
          firstname: FirstName,
          lastname: LastName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5FB] flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
      
      {/* Subtle background soft accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F7F4FE] rounded-full blur-[120px] pointer-events-none opacity-80" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F7E8F0]/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* LEFT SIDE: Branding (Hidden on mobile) */}
        <div className="text-[#252525] space-y-8 col-span-7 hidden md:block pr-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D43F6C] shadow-sm">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#252525]">
                Dev<span className="text-[#D43F6C]">Connect</span>
              </h1>
              <p className="text-xs text-[#8A8A8A] font-semibold uppercase tracking-wider">
                Developer Network
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#252525]">
              Swipe. Match. Connect.
            </h2>
            <p className="text-lg text-[#666666] leading-relaxed max-w-md">
              A peer-matching platform designed for developers to collaborate, share projects, and learn.
            </p>
          </div>

          <div className="space-y-5 pt-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#D43F6C] shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#252525]">Discover Peers</h3>
                <p className="text-sm text-[#666666]">Find students and developers with matching interests or complementary tech stacks.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#D43F6C] shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#252525]">Direct Messaging</h3>
                <p className="text-sm text-[#666666]">Connect instantly and chat with your matches in real-time about your hackathons or projects.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#D43F6C] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#252525]">Build Collaborations</h3>
                <p className="text-sm text-[#666666]">Go beyond networking—find team members for your college project or startup ideas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Auth Form Card */}
        <div className="col-span-12 md:col-span-5 w-full max-w-md mx-auto">
          
          {/* Logo visible only on Mobile */}
          <div className="flex flex-col items-center gap-2 mb-8 md:hidden text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D43F6C] shadow-sm">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#252525] tracking-wide">
              Dev<span className="text-[#D43F6C]">Connect</span>
            </h1>
            <p className="text-xs text-[#8A8A8A] uppercase tracking-widest font-semibold">
              Developer Network
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E3EC] p-8 rounded-2xl shadow-sm text-[#252525]">
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#252525] text-center">
                {isLoginForm ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-center text-[#666666] text-sm mt-1">
                {isLoginForm ? "Enter details to access your account" : "Join the developer network today"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              
              {!isLoginForm && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E3EC] text-[#252525] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#D43F6C] focus:ring-1 focus:ring-[#D43F6C] transition duration-150 text-sm"
                />
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-600 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={isLoginForm ? handleLogin : handleSignUp}
                className={`w-full py-2.5 ${isLoginForm ? "bg-[#D43F6C] hover:bg-[#c0325d]" : "bg-[#F05A24] hover:bg-[#E85D04]"} text-white font-semibold rounded-xl shadow-sm transition duration-150 text-sm active:scale-[0.98] mt-2 cursor-pointer`}
              >
                {isLoginForm ? "Sign In" : "Get Started"}
              </button>

            </div>

            {/* Toggle Link */}
            <p className="text-sm text-[#666666] mt-6 text-center">
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLoginForm((value) => !value);
                  setError("");
                }}
                className="text-[#D43F6C] hover:text-[#ED488F] font-semibold cursor-pointer hover:underline ml-1.5 focus:outline-none"
              >
                {isLoginForm ? "Create an account" : "Sign in"}
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;