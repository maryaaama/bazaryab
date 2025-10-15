"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdsFullTable from "@/components/AdsFullTable";
import AdminFiltersNeon from "@/components/AdminFiltersNeon";
import {
  applyAllFilters
} from "@/lib/filters";


export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // فیلترهای فرانت
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showMyAds, setShowMyAds] = useState(false);

  // 👇 دریافت اطلاعات کاربر
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      router.push("/auth");
      return;
    }
    try {
      setUserData(JSON.parse(data));
    } catch {
      router.push("/auth");
    }
  }, [router]);

  // 👇 دریافت آگهی‌ها از دیتابیس – بدون تغییر
  
  useEffect(() => {
    const fetchAdsFull = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ads_full", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setAds(data);
      } catch (err) {
        console.error("خطا در دریافت آگهی‌ها:", err);
      }
      setLoading(false);
    };
    fetchAdsFull();
  }, []);

  useEffect(() => {
  if (!userData) return;
  let result = [...ads];

  result = filterByLocation(result, locationFilter);
  result = filterByPriceRange(result, priceFrom, priceTo);
  result = filterByStatus(result, statusFilter);
  result = filterMyAds(result, userData.id, showMyAds);
  setFilteredAds(result);
   }, [ads, locationFilter, statusFilter, showMyAds, userData]);
   function filtersActive() {
    return locationFilter || priceFrom || priceTo || statusFilter || showMyAds;
    }
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300 font-[Vazirmatn] text-lg">
        در حال بارگذاری اطلاعات کاربر...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0a1a2f] text-gray-200 flex flex-col sm:flex-row-reverse font-[Vazirmatn]">
      
      {/* 🔹 سایدبار / بالای صفحه در موبایل */}
      <aside className="w-full sm:w-72 bg-[#04111f] border-b sm:border-b-0 sm:border-l border-cyan-700 flex flex-col sm:items-end p-4 sm:p-6">
        
        {/* 👤 پروفایل */}
        <div className="mb-4 sm:mb-6 w-full text-right">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-300 mb-2">پروفایل</h2>
          <p className="font-en"> {userData.username} <span className="font-bold font-[Vazirmatn]"> : نام کاربری </span></p>
          
          
          <p className="mt-2">
            <span
              className="px-2 py-1 rounded text-xs sm:text-sm inline-block mt-1"
              style={{ backgroundColor: userData.user_color }}
            >
              {userData.user_color}
            </span>
            <span className="font-bold font-[Vazirmatn]"> : رنگ ثابت</span>{" "}
            
          </p>
          <p className="mt-2">
            <span className="text-cyan-400 font-en">{userData.user_role}</span>
            <span className="font-bold"> :نقش</span>{" "}
            
          </p>
        </div>

        {/* 🔸 دکمه‌ها */}
        <nav className="flex flex-row sm:flex-col gap-2 sm:gap-3 w-full justify-around font-[Vazirmatn] sm:justify-end text-center sm:text-right">

        <button
           onClick={() => {
             if (!userData?.id) return;
             const result = filterMyAds(ads, userData.id, true);
             setFilteredAds(result);
           }}
           className="font-[Vazirmatn] mt-2 w-full text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-700 text-gray-100 
                      hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/40 rounded-lg 
                      py-2.5 transition-colors shadow-md active:scale-[0.98]"
         >
           👤 آگهی‌های من
         </button>

          <button
            onClick={() => {
             // پاک کردن فیلترها
             setShowMyAds(false);
             setStatusFilter("");
             setLocationFilter("");
             setPriceFrom("");
             setPriceTo("");
             setFilteredAds(ads);// داده‌ی کامل از API
           }}
           className="font-[Vazirmatn] mt-2 w-full text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-700 text-gray-100 
                      hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/40 rounded-lg 
                      py-2.5 transition-colors shadow-md active:scale-[0.98]"
         >
           🔄 نمایش همه آگهی‌ها
         </button>

        </nav>

        {/* 🧩 فیلترهای دسکتاپ */}
        <div className="hidden sm:flex flex-col w-full text-right mt-5 space-y-3 border-t border-cyan-700 pt-4 text-sm">
          <label>موقعیت:</label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="مثلاً نارمک"
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 placeholder-gray-400 focus:outline-none"
          />

          <label>قیمت از:</label>
          <input
            type="number"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none"
          />

          <label className="">قیمت تا:</label>
          <input
            type="number"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none"
          />
             {/* ✅ دکمه اعمال فیلتر قیمت */}
             <button
               onClick={() => {
                 const result = filterByPriceRange(ads, priceFrom, priceTo);
                 setFilteredAds(result);
               }}
               className="font-[Vazirmatn] mt-2 w-full text-sm font-medium py-2.5 px-3 
             bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 
             text-gray-100 rounded-lg 
             shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,255,255,0.3)] 
             hover:shadow-[inset_0_-1px_3px_rgba(255,255,255,0.3),0_6px_14px_rgba(0,255,255,0.5)] 
             hover:scale-[1.03] active:scale-[0.97] 
             transition-all duration-300 ease-in-out border border-pink-400/40 backdrop-blur-sm"
             >
               اعمال فیلتر قیمت 💰
             </button>
          <label>وضعیت:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none"
          >
             <option value="">— همه وضعیت‌ها —</option>
            <option value="new">ثبت جدید</option>
            <option value="contacted">تماس گرفته</option>
            <option value="interested">علاقه‌مند</option>
            <option value="closed">بسته شده</option>
          </select>
        </div>
        <button
        onClick={() => {
         localStorage.removeItem("userData");
          window.location.href = "/";
         }}
           className="font-[Vazirmatn] mt-6 w-full text-sm font-medium py-2.5 rounded-lg text-gray-100 
             bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 
             shadow-[0_0_25px_rgba(255,105,180,0.4)] border border-cyan-300/30
             hover:shadow-[0_0_35px_rgba(255,105,180,0.6)] 
             hover:from-cyan-300 hover:to-pink-400 
             transition-all duration-300 active:scale-[0.98]"
           >
          بازگشت به صفحه اصلی
          </button>


      </aside>

      {/* 🟩 بخش اصلی جدول */}
      <main className="flex-1 p-4 sm:p-6 space-y-6">
        <AdminFiltersNeon userId={userData.id} userRole={userData.user_role} />

        {/* 🔻 فیلتر موبایل */}
        <div className="flex sm:hidden flex-col space-y-2 bg-[#04111f] border border-cyan-700 p-3 rounded">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="مثلاً نارمک"
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="قیمت از"
              className="flex-1 rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-sm"
            />
            <input
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="قیمت تا"
              className="flex-1 rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-sm"
          >
             <option value="">— همه وضعیت‌ها —</option>
              <option value="new">ثبت جدید</option>
              <option value="contacted">تماس گرفته</option>
              <option value="interested">علاقه‌مند</option>
              <option value="closed">بسته شده</option>
           </select>
          <button
            onClick={() => setShowMyAds((p) => !p)}
            className={`rounded px-3 py-2 mt-2 transition-all text-sm ${
              showMyAds ? "bg-cyan-600" : "bg-cyan-700 hover:bg-cyan-600"
            }`}
          >
            فقط آگهی‌های من
          </button>
        </div>

        {/* 📋 جدول نهایی آگهی‌ها */}
        {loading ? (
          <p className="text-center text-gray-400 mt-6 text-sm">در حال بارگذاری آگهی‌ها...</p>
        ) : (
          <AdsFullTable
            ads={filteredAds.length > 0 || filtersActive() ? filteredAds : ads}
            userId={userData?.id}
            username={userData?.username}
            userRole={userData?.user_role}
            userColor={userData?.user_color}
          />
        )}
      </main>
    </div>
  );

  // کمک برای تشخیص فعال بودن فیلترها
  function filtersActive() {
    return (
      locationFilter || priceFrom || priceTo || statusFilter || showMyAds
    );
  }
}
