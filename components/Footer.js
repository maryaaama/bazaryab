"use client";
import Link from "next/link";
import { FaLinkedin, FaYoutube, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#050010] via-[#090018] to-[#0a0220] border-t border-cyan-600/30 shadow-[0_0_40px_rgba(255,0,255,0.25)]  font-[Vazirmatn] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-right">

        {/* بخش اول: ارتباط با ما */}
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_6px_rgba(255,0,255,0.5)]">
            ارتباط با ما
          </h3>
          <p className="text-cyan-200/80 text-base md:text-lg">تلفن: ۰۹۱۲-۳۴۵-۶۷۸۹</p>
          <p className="text-cyan-200/80 mt-1">آدرس: تهران، خیابان شریعتی، ساختمان وب</p>
        </div>

        {/* بخش دوم: لینک‌های آموزشی */}
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent mb-4">
            لینک‌های آموزشی
          </h3>
          <Link href="/training" className="block text-cyan-300 hover:text-pink-400 transition-all duration-200">
            آموزش کار با سایت
          </Link>
          <Link href="/support" className="block mt-2 text-cyan-300 hover:text-pink-400 transition-all duration-200">
            پشتیبانی فنی
          </Link>
        </div>

        {/* بخش سوم: شبکه‌های اجتماعی با آیکون‌های SVG نئونی */}
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent mb-4">
            شبکه‌های اجتماعی
          </h3>

          <div className="flex items-center justify-end gap-4 mt-3 flex-wrap">
            <Link href="https://linkedin.com" target="_blank">
             <FaLinkedin className="text-cyan-300 text-[2rem] hover:text-pink-400 drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] transition-all duration-300 hover:scale-110" />
            </Link>
            <Link href="https://youtube.com" target="_blank">
               <FaYoutube className="text-pink-400 text-[2rem] hover:text-cyan-300 drop-shadow-[0_0_12px_rgba(255,0,255,0.6)] transition-all duration-300 hover:scale-110" />
            </Link>
            <Link href="https://telegram.me" target="_blank">
              <FaTelegramPlane className="text-cyan-300 text-[2rem] hover:text-pink-400 drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] transition-all duration-300 hover:scale-110" />
            </Link>
            <Link href="https://wa.me/09123456789" target="_blank">
               <FaWhatsapp className="text-pink-400 text-[2rem] hover:text-cyan-300 drop-shadow-[0_0_12px_rgba(255,0,255,0.6)] transition-all duration-300 hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>

      {/* خط پایانی و لوگو Alipourweb */}
      <div className="border-t border-cyan-700 mt-8 text-center py-4 text-sm">
        <span className="bg-gradient-to-r from-cyan-300 to-pink-500 bg-clip-text text-transparent font-bold text-lg md:text-xl tracking-wider drop-shadow-[0_0_8px_rgba(255,0,255,0.4)]">
          Alipourweb
        </span>
        <p className="text-cyan-200/70 mt-2">
          © 2025 طراحی و توسعه توسط تیم بازاریاب 💙
        </p>
      </div>
    </footer>
  );
};

export default Footer;
