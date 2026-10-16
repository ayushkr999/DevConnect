import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E9E3EC] bg-[#FFFFFF] mt-12">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-10 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-8 items-center justify-center rounded-md bg-[#D43F6C] text-white shadow-sm">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#252525]">
            Dev<span className="text-[#D43F6C]">Connect</span>
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#8A8A8A] text-center">
          © {new Date().getFullYear()} DevConnect. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-5 text-xs text-[#666666]">
          <a href="#" className="hover:text-[#D43F6C] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#D43F6C] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#D43F6C] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
