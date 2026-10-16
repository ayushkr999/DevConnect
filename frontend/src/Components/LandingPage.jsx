import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Compass,
  User,
  UserPlus,
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Navbar entrance
      if (navRef.current) {
        gsap.from(navRef.current, {
          y: -15,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // 2. Hero content entrance
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.1,
        });
      }

      // 3. Feature cards stagger on scroll
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 25,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        });
      }

      // 4. CTA section entrance on scroll
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5FB] text-[#252525] flex flex-col relative overflow-x-hidden">
      {/* Background soft ambient accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#F7F4FE] blur-[140px] opacity-70" />
        <div className="absolute right-0 top-60 h-96 w-96 rounded-full bg-[#F7E8F0]/50 blur-[150px]" />
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#F7F4FE] blur-[160px] opacity-60" />
      </div>

      {/* ================================================== */}
      {/* 1. NAVBAR                                          */}
      {/* ================================================== */}
      <header
        ref={navRef}
        className="sticky top-0 z-50 w-full border-b border-[#E9E3EC] bg-[#FFFFFF]/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D43F6C] text-white shadow-xs group-hover:bg-[#ED488F] transition duration-200">
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

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              onClick={scrollToFeatures}
              className="text-sm font-semibold text-[#666666] hover:text-[#252525] px-3 py-1.5 rounded-lg hover:bg-[#F7F4FE] transition duration-150 cursor-pointer"
            >
              Features
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-[#252525] hover:text-[#D43F6C] px-3.5 py-1.5 rounded-xl hover:bg-[#FAF5FB] transition duration-150"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white bg-[#D43F6C] hover:bg-[#c0325d] px-4 py-2 rounded-xl shadow-xs transition duration-150 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* 2. HERO SECTION                                    */}
      {/* ================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 flex-1 flex flex-col justify-center">
        <div
          ref={heroRef}
          className="max-w-3xl mx-auto text-center flex flex-col items-center"
        >
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7E8F0] border border-[#E9E3EC] text-[#D43F6C] text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer Networking Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#252525] leading-tight">
            Connect. Match. <span className="text-[#D43F6C]">Collaborate.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-[#666666] leading-relaxed max-w-2xl">
            DevConnect is a developer networking platform to discover developers,
            build connections, and collaborate on projects.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] text-white font-semibold text-sm sm:text-base shadow-xs transition duration-150 active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-xl border border-[#E9E3EC] bg-[#FFFFFF] hover:bg-[#FAF5FB] text-[#252525] font-semibold text-sm sm:text-base transition duration-150 shadow-2xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. FEATURES                                        */}
      {/* ================================================== */}
      <section
        id="features"
        ref={featuresRef}
        className="px-4 sm:px-6 lg:px-8 py-20 border-t border-[#E9E3EC] bg-[#FFFFFF]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
              Everything You Need to Build Your Network
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#666666]">
              Explore the core features designed to help you connect and collaborate with fellow developers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                1. Discover Developers
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Users can discover other developers based on their profiles, skills and interests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                2. Developer Profiles
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-3">
                Users can create and update their profile with:
              </p>
              <ul className="text-xs sm:text-sm text-[#666666] space-y-1.5 mt-auto">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>Name</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>Age</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>Gender</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>About</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>Profile photo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#18A866] shrink-0" />
                  <span>Skills</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <UserPlus className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                3. Connect With Developers
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Users can send connection requests to other developers and accept or reject incoming requests.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                4. Real-Time Chat
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Connected developers can communicate through real-time messaging.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                5. Connections
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Users can view their connected developers and start conversations with them.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-xs transition duration-200 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#252525] mb-2">
                6. Profile Matching
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Users can browse developer profiles and choose whether to connect or skip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 4. SIMPLE CTA                                      */}
      {/* ================================================== */}
      <section
        ref={ctaRef}
        className="px-4 sm:px-6 lg:px-8 py-20 bg-[#FAF5FB] border-t border-[#E9E3EC]"
      >
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
            Start building your developer network.
          </h2>

          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] text-white font-semibold text-base shadow-xs transition duration-150 active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-sm text-[#666666]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#D43F6C] hover:text-[#c0325d] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* 5. FOOTER                                          */}
      {/* ================================================== */}
      <footer className="border-t border-[#E9E3EC] bg-[#FFFFFF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#252525]">
              Dev<span className="text-[#D43F6C]">Connect</span>
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium uppercase tracking-wider">
              Developer Network
            </span>
          </div>

          <p className="text-xs text-[#8A8A8A]">
            © 2026 DevConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
