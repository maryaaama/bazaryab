"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdsFullTable from "@/components/AdsFullTable";
import AdminFiltersNeon from "@/components/AdminFiltersNeon";
import { applyAllFilters, filterMyAds } from "@/lib/filters";

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

  // دریافت اطلاعات کاربر
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

  // دریافت آگهی‌ها از دیتابیس
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

  // همگام‌سازی اولیه آگهی‌ها
  useEffect(() => {
    if (!userData) return;
    setFilteredAds(ads);
  }, [ads, userData]);

  // دکمه اعمال فیلتر
  const handleApplyFilters = () => {
    const result = applyAllFilters(ads, {
      location: locationFilter,
      from: priceFrom,
      to: priceTo,
      status: statusFilter,
      userId: userData.id,
      showMyAds,
    });
    setFilteredAds(result);
  };

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
      {/* 🔹 سایدبار */}
      <aside className="w-full sm:w-72 bg-[#04111f] border-b sm:border-b-0 sm:border-l border-cyan-700 flex flex-col sm:items-end p-4 sm:p-6">
        {/* 👤 پروفایل */}
        <div className="mb-4 sm:mb-6 w-full text-right">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-300 mb-2">پروفایل</h2>
          <p className="font-en text-cyan-400">
            {userData.username}
            <span className="font-bold font-[Vazirmatn] text-gray-200"> : نام کاربری </span>
          </p>
          <p className="mt-2">
            <span
              className="px-2 py-1 rounded text-xs sm:text-sm inline-block mt-1 text-gray-100 font-bold"
              style={{ backgroundColor: userData.user_color }}
            >
              {userData.user_color}
            </span>
            <span className="font-bold font-[Vazirmatn]"> : رنگ ثابت </span>
          </p>
          <p className="mt-2">
            <span className="text-cyan-400 font-en font-bold">{userData.user_role}</span>
            <span className="font-bold text-gray-200"> : نقش </span>
          </p>
        </div>

        {/* 🔸 دکمه‌ها */}
        <nav className="flex flex-row sm:flex-col gap-3 w-full justify-around font-[Vazirmatn] sm:justify-end text-center sm:text-right">
          <button
           onClick={() => {
  if (!userData?.id) return;
  const result = applyAllFilters(ads, {
    location: locationFilter,
    from: priceFrom,
    to: priceTo,
    status: statusFilter,
    userId: userData.id,
    showMyAds: true,
  });
  setFilteredAds(result);
}}
            className="font-[Vazirmatn] w-full text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-700 
                      text-gray-100 hover:from-cyan-400 hover:to-blue-600 border border-cyan-500/40 rounded-lg 
                      py-2.5 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            👤 آگهی‌های من
          </button>

          <button
            onClick={() => {
              setShowMyAds(false);
              setStatusFilter("");
              setLocationFilter("");
              setPriceFrom("");
              setPriceTo("");
              setFilteredAds(ads);
            }}
            className="font-[Vazirmatn] w-full text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 
                      text-gray-100 hover:from-blue-500 hover:to-cyan-400 border border-cyan-500/40 rounded-lg 
                      py-2.5 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            🔄 نمایش همه آگهی‌ها
          </button>
        </nav>

        {/* 🧩 فیلترها */}
        <div className="hidden sm:flex flex-col w-full text-right mt-6 space-y-3 border-t border-cyan-700 pt-4 text-sm">
          <label className="font-semibold text-cyan-300">موقعیت:</label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="مثلاً نارمک"
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 placeholder-gray-400 focus:outline-none text-base"
          />

          <label className="font-semibold text-cyan-300">قیمت از:</label>
          <input
            type="number"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-base"
          />

          <label className="font-semibold text-cyan-300">قیمت تا:</label>
          <input
            type="number"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-base"
          />

          <label className="font-semibold text-cyan-300">وضعیت:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded bg-[#0a1a2f] border border-cyan-700 p-2 text-gray-200 focus:outline-none text-base"
          >
            <option value="">— همه وضعیت‌ها —</option>
            <option value="new">ثبت جدید</option>
            <option value="contacted">تماس گرفته</option>
            <option value="interested">علاقه‌مند</option>
            <option value="closed">بسته شده</option>
          </select>

          {/* 💎 دکمه اعمال فیلتر کلی */}
          <button
            onClick={handleApplyFilters}
            className="font-[Vazirmatn] mt-2 w-full text-base font-semibold py-2.5 px-3 
                       bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 text-gray-100 rounded-lg 
                       shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,255,255,0.3)] 
                       hover:shadow-[inset_0_-1px_3px_rgba(255,255,255,0.3),0_6px_14px_rgba(0,255,255,0.5)] 
                       hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-in-out 
                       border border-pink-400/40 backdrop-blur-sm"
          >
            اعمال فیلترها ✨
          </button>
        </div>

        {/* دکمه بازگشت */}
        <button
          onClick={() => {
            localStorage.removeItem("userData");
            window.location.href = "/";
          }}
          className="font-[Vazirmatn] mt-6 w-full text-base font-semibold py-2.5 rounded-lg text-gray-100 
                     bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 
                     shadow-[0_0_25px_rgba(255,105,180,0.4)] border border-cyan-300/30
                     hover:shadow-[0_0_35px_rgba(255,105,180,0.6)] 
                     hover:from-cyan-300 hover:to-pink-400 transition-all duration-300 active:scale-[0.98]"
        >
          بازگشت به صفحه اصلی
        </button>
      </aside>

      {/* 🟩 جدول */}
      <main className="flex-1 p-4 sm:p-6 space-y-6">
        <AdminFiltersNeon userId={userData.id} userRole={userData.user_role} />

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
}
