"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#020617] to-[#0a1a2f] border-b border-cyan-700/40 shadow-[0_0_20px_rgba(0,200,255,0.15)] font-[Vazirmatn]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* لوگو */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-semibold text-cyan-300 drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
            Alipourweb
          </span>
        </Link>

        {/* منوی دسکتاپ */}
        {/* منوی دسکتاپ */}
        {/* منوی دسکتاپ */}
       <nav className="hidden md:flex items-center gap-8 font-[Vazirmatn]">
            {!user ? (
              <Link
                href="/auth"
                className="text-xl font-bold text-cyan-300 hover:text-cyan-400 transition-colors duration-200"
              >
                ورود
              </Link>
            ) : (
              <Link
                href="/auth"
                className="text-xl font-bold text-cyan-300 hover:text-cyan-400 transition-colors duration-200"
              >
                ورود
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Bazaryab
            </h1>
          </nav>

        {/* منوی موبایل */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-cyan-300 focus:outline-none">☰</button>
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-[#0a1a2f] border border-cyan-700 rounded-lg shadow-lg p-4 flex flex-col gap-3">
              {!user ? (
                <Link href="/auth" onClick={() => setMenuOpen(false)}>ورود</Link>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>داشبورد</Link>
                  <button onClick={handleLogout}>خروج</button>
                </>
              )}
              <span className="text-pink-300 font-bold">Bazaryab</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
