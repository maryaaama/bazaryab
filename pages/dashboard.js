"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// ایمپورت کامپوننت‌ها
import AdsFullTable from "@/components/AdsFullTable";
import AdminFiltersNeon from "@/components/AdminFiltersNeon";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  
  useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setAllUsers(data);
  };
  fetchUsers();
}, []);

  // 🎯 دریافت اطلاعات کاربر از localStorage
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      router.push("/auth");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setUserData(parsed);
    } catch (err) {
      console.error("خطا در خواندن داده‌های کاربر:", err);
      router.push("/auth");
    }
  }, [router]);

  // 📡 دریافت آگهی‌ها از جدول ads_full
  useEffect(() => {
    const fetchAdsFull = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ads_full", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setAds(data);
        } else {
          console.error("خطا در دریافت آگهی‌ها:", data.error);
        }
      } catch (err) {
        console.error("ارتباط با سرور برقرار نشد", err);
      }
      setLoading(false);
    };

    fetchAdsFull();
  }, []); // ✅ اجرا فقط یک‌بار هنگام Mount

  // 📥 نمایش لودر در حالت بارگذاری یا نبود داده کاربر
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white font-[Vazirmatn] text-lg">
        در حال بارگذاری اطلاعات کاربر...
      </div>
    );
  }

  // 🎨 Render اصلی داشبورد
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0a1a2f] text-white flex flex-row-reverse font-[Vazirmatn]">
      
      {/* 🟦 سایدبار راست */}
      <aside className="w-72 bg-[#04111f] border-l border-cyan-700 flex flex-col items-end p-6">
        <div className="mb-6 w-full text-right">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">پروفایل</h2>
          <p><span className="font-bold">نام کاربری:</span> {userData.username}</p>

          <p className="mt-2">
            <span className="font-bold">رنگ ثابت:</span>{" "}
            <span
              className="px-2 py-1 rounded"
              style={{ backgroundColor: userData.user_color }}
            >
              {userData.user_color}
            </span>
          </p>

          <p className="mt-2">
            <span className="font-bold">نقش کاربر:</span>
            <span className="text-cyan-400 font-semibold"> {userData.user_role || "—"}</span>
          </p>

          <p className="mt-2">
            <span className="font-bold">تاریخ عضویت:</span>{" "}
            {new Date(userData.created_at).toLocaleDateString("fa-IR")}
          </p>
        </div>

        <nav className="flex flex-col gap-3 mt-4 w-full text-right">
          <button className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded transition-all">
            آگهی‌های من
          </button>
          <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded transition-all">
            افزودن آگهی
          </button>
          <button className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded transition-all">
            فیلترها
          </button>
        </nav>
      </aside>

      {/* 🟩 محتوای اصلی داشبورد */}
      <main className="flex-1 p-6 space-y-6">
        {/* ⚡ کامپوننت فیلترهای نئونی برای مدیریت فیلترهای ادمین */}
        <AdminFiltersNeon userId={userData.id} userRole={userData.user_role} />

        {/* 📋 جدول آگهی‌ها */}
        {loading ? (
          <p className="text-center text-gray-400 mt-6">در حال بارگذاری آگهی‌ها...</p>
        ) : (
          <AdsFullTable
             ads={ads}
             userId={userData.id}
             username={userData.username}
             userRole={userData.user_role}
             userColor={userData.user_color}
           />
        )}
      </main>
    </div>
  );
}
