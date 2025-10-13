"use client";
import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 font-[Vazirmatn] bg-gradient-to-b from-[#050010] to-[#0a0220] border-b border-cyan-700/40 shadow-[0_0_20px_rgba(255,0,255,0.15)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* لوگو Alipourweb (دسکتاپ) */}
        <Link href="/" className="hidden md:block text-[1.8rem] font-extrabold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,0,255,0.5)]">
          Alipourweb
        </Link>

        {/* در حالت موبایل Bazaryab نمایش داده می‌شود */}
        <Link href="/" className="md:hidden text-[1.4rem] font-bold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
          Bazaryab
        </Link>

        {/* بخش راست هدر (دکمه ورود + Bazaryab دسکتاپ) */}
        <div className="flex items-center gap-4">
          {/* Bazaryab دسکتاپ فقط در حالت Large */}
          <span className="hidden md:inline-block text-[1.3rem] font-semibold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]">
            Bazaryab
          </span>

          <Link
            href="/auth"
            className="px-5 py-2 border border-cyan-400 rounded-lg text-cyan-300 font-bold hover:bg-cyan-400 hover:text-[#0a0220] transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] duration-300"
          >
            ورود
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
