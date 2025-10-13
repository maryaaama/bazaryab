"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import AdsTable from "@/components/AdsTable";
import SendLink from "@/components/SendLink";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ads", { cache: "no-store" }); // جلوگیری از کش
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

  useEffect(() => {
    if (!loadedOnce) {
      fetchAds(); // یکبار بعد از لود صفحه
      setLoadedOnce(true);
    }
  }, [loadedOnce]);

  return (
    <div className="bg-gradient-to-b from-[#020617] to-[#0a1a2f] text-white font-[Vazirmatn] min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="text-center pt-36 pb-6">
        <h1 className="text-3xl font-bold text-cyan-300 mb-4">
          سامانه مدیریت و جستجوی آگهی
        </h1>
        <p className="font-[Vazirmatn] text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto mb-4">
          در این صفحه فقط ۲۰ آگهی اول نمایش داده می‌شود. برای مشاهده جزئیات، فیلتر کردن یا ورود به صفحه هر آگهی وارد شوید.
        </p>
      </section>

      {/* ارسال لینک سریع */}
      <div className="px-6 max-w-4xl mx-auto mb-8">
         <SendLink onSuccess={fetchAds} />
      </div>

      {/* نمایش آگهی‌ها */}
      <div className="px-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="text-center text-cyan-300">در حال بارگذاری...</div>
        ) : (
          <AdsTable
            ads={ads.slice(0, 20)}
            disableLinks={true}
            showClearButton={true}
            onClear={() => setAds([])}
          />
        )}
      </div>
    </div>
  );
}
