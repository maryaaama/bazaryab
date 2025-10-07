"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import AdsTable from "@/components/AdsTable";
import SendLink from "@/components/SendLink";

export default function Home() {
  const [ads, setAds] = useState([
    { id: "1", title: "آیفون ۱۳", info: "در حد نو", price: "۵۰ میلیون", location: "تهران", url: "#" },
    { id: "2", title: "پژو ۲۰۶", info: "مدل ۹۸", price: "۴۰۰ میلیون", location: "اصفهان", url: "#" },
    // ... داده‌های نمونه بیشتر
  ]);

  return (
    <div className="bg-gradient-to-b from-[#020617] to-[#0a1a2f] text-white font-[Vazirmatn] min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="text-center pt-36 pb-12">
        <h1 className="text-3xl font-bold text-cyan-300 mb-4">سامانه مدیریت و جستجوی آگهی</h1>
        <p className="font-[Vazirmatn] text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
          در این صفحه فقط ۲۰ آگهی اول نمایش داده می‌شود. برای مشاهده جزئیات، فیلتر کردن یا ورود به صفحه هر آگهی وارد شوید.
        </p>
      </section>

      {/* ارسال لینک سریع */}
      <div className="px-6 max-w-4xl mx-auto mb-8">
        <SendLink />
      </div>

      {/* نمایش نمونه آگهی‌ها */}
      <div className="px-6 max-w-5xl mx-auto">
        <AdsTable
          ads={ads.slice(0, 20)}
          disableLinks={true}
          showClearButton={true}
          onClear={() => setAds([])}
        />
      </div>
    </div>
  );
}
