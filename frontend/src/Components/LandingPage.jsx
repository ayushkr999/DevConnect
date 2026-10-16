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
  CheckCheck,
  Send,
  Heart,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroVisualRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Navbar entrance
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }

      // 2. Hero text content entrance
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      }

      // 3. Hero visual preview entrance
      if (heroVisualRef.current) {
        gsap.fromTo(
          heroVisualRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.25,
          }
        );
      }

      // 4. Feature cards stagger on scroll
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.fromTo(
          cards,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 5. CTA section entrance on scroll
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
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
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text Content */}
            <div
              ref={heroTextRef}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Subtle Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7E8F0] border border-[#E9E3EC] text-[#D43F6C] text-xs font-semibold mb-6 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Developer Networking Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#252525] leading-tight">
                Connect. Match. <span className="text-[#D43F6C]">Collaborate.</span>
              </h1>

              {/* Description */}
              <p className="mt-5 text-base sm:text-lg text-[#666666] leading-relaxed max-w-xl">
                DevConnect is a developer networking platform that helps developers
                discover like-minded people, showcase their skills, build
                meaningful connections, and communicate through real-time chat.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <a
                  href="#features"
                  onClick={scrollToFeatures}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#E9E3EC] bg-[#FFFFFF] hover:bg-[#FAF5FB] text-[#252525] font-semibold text-sm sm:text-base transition duration-150 shadow-2xs cursor-pointer"
                >
                  <Compass className="h-4 w-4 text-[#D43F6C]" />
                  <span>Explore Features</span>
                </a>

                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D43F6C] hover:bg-[#c0325d] text-white font-semibold text-sm sm:text-base shadow-xs transition duration-150 active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Subtle Platform Indicators */}
              <div className="mt-10 pt-6 border-t border-[#E9E3EC] w-full max-w-md flex items-center justify-between text-xs text-[#8A8A8A] font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#18A866]" />
                  <span>Real-Time Sockets</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#D43F6C]" />
                  <span>Profile Matching</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#F05A24]" />
                  <span>Direct Chat</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Preview of Real DevConnect UI */}
            <div
              ref={heroVisualRef}
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Main Card: Developer Profile Preview */}
                <div className="bg-[#FFFFFF] border border-[#E9E3EC] rounded-2xl shadow-md overflow-hidden transition duration-200">
                  {/* Card Header with Photo */}
                  <div className="relative h-60 bg-[#FAF5FB] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                      alt="Sarah Chen"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    
                    {/* User Name & Info */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight">
                          Sarah Chen
                        </h2>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#18A866] border-2 border-white" />
                      </div>
                      <p className="text-xs text-white/90 font-medium mt-0.5">
                        24 yrs • Full Stack Developer
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Skills Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "Node.js", "MongoDB", "TailwindCSS"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F7E8F0] text-[#B8325A] border border-[#E9E3EC]"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>

                    <p className="text-xs text-[#666666] leading-relaxed line-clamp-2 italic">
                      "Building responsive full-stack applications. Looking for peers to collaborate on open-source web projects!"
                    </p>

                    {/* Matching Action Buttons */}
                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-xl border border-[#E9E3EC] bg-[#FFFFFF] text-[#666666] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FAF5FB] transition cursor-default"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Ignore</span>
                      </button>

                      <button
                        type="button"
                        className="flex-1 py-2 rounded-xl bg-[#F05A24] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#E85D04] transition cursor-default"
                      >
                        <Heart className="h-3.5 w-3.5 fill-white" />
                        <span>Connect</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Preview Element 1: Connection Request Notification */}
                <div className="absolute -top-6 -left-4 sm:-left-8 bg-[#FFFFFF] border border-[#E9E3EC] rounded-2xl p-3 shadow-md flex items-center gap-3 max-w-[260px] animate-in fade-in duration-300">
                  <div className="w-8 h-8 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center shrink-0">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#252525] truncate">
                      Connection Accepted
                    </p>
                    <p className="text-[10px] text-[#666666] truncate">
                      Alex Rivera connected with you
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#18A866]/10 text-[#18A866] flex items-center justify-center shrink-0 ml-auto">
                    <Check className="h-3 w-3" />
                  </div>
                </div>

                {/* Floating Preview Element 2: Real-Time Chat Message Bubble */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-[#FFFFFF] border border-[#E9E3EC] rounded-2xl p-3 shadow-md flex items-center gap-2.5 max-w-[270px]">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5FB] border border-[#E9E3EC] flex items-center justify-center shrink-0 text-[#D43F6C]">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#252525]">
                        Alex
                      </span>
                      <span className="text-[9px] text-[#8A8A8A]">Just now</span>
                    </div>
                    <p className="text-[10px] text-[#666666] truncate">
                      "Hey! Loved your profile. Want to collaborate?"
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. FEATURES SECTION                                */}
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

          {/* Features Grid: 3 cols on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  1. Discover Developers
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Discover other developers based on their profiles, skills, and interests.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  2. Developer Profiles
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed mb-3">
                  Create and update your profile with your name, age, gender, about section, profile photo, and skills.
                </p>
              </div>

              {/* Profile fields indicators */}
              <div className="pt-3 border-t border-[#FAF5FB] flex flex-wrap gap-1.5 mt-2">
                {["Name", "Age", "Gender", "About", "Photo", "Skills"].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F7E8F0] text-[#B8325A]"
                    >
                      <Check className="h-2.5 w-2.5 text-[#18A866]" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  3. Connect With Developers
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Send connection requests to other developers and accept or reject incoming requests.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  4. Real-Time Chat
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Communicate with connected developers through real-time messaging.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  5. Connections
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  View your connected developers and start conversations with them.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-card p-6 rounded-2xl border border-[#E9E3EC] bg-[#FFFFFF] shadow-2xs hover:border-[#D43F6C]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#F7E8F0] text-[#D43F6C] flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252525] mb-2">
                  6. Profile Matching
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Browse developer profiles and choose whether to connect or skip.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 4. CALL TO ACTION SECTION                          */}
      {/* ================================================== */}
      <section
        ref={ctaRef}
        className="px-4 sm:px-6 lg:px-8 py-20 bg-[#FAF5FB] border-t border-[#E9E3EC]"
      >
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
            Start Building Your Developer Network
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#666666] max-w-lg leading-relaxed">
            Discover developers, build connections, and start meaningful conversations with DevConnect.
          </p>

          <div className="mt-7">
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
