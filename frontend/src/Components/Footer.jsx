import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 mt-12">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-10 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-8 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">
            Dev<span className="text-indigo-400">Connect</span>
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} DevConnect. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-5 text-xs text-slate-400">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
