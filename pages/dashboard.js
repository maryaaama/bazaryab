"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// ایمپورت کامپوننت‌ها
import AdsTable from "@/components/AdsTable";
import SendLink from "@/components/SendLink";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  // داده‌های آگهی — فعلاً تستی
  const [ads, setAds] = useState([
    {
      id: "1",
      title: "آگهی تستی ۱",
      info: "توضیحات کوتاه",
      price: "۵۰۰٬۰۰۰",
      location: "تهران",
      url: "https://divar.ir",
    },
    {
      id: "2",
      title: "آگهی تستی ۲",
      info: "اطلاعات دوم",
      price: "۱٬۲۰۰٬۰۰۰",
      location: "مشهد",
      url: "https://divar.ir",
    },
  ]);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      router.push("/auth");
      return;
    }
    setUserData(JSON.parse(data));
  }, [router]);

  const handleSendLink = (link) => {
    console.log("لینک ارسال شد:", link);
    // اینجا می‌توانی API کال کنی و جدول را آپدیت کنی
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0a1a2f] text-white flex flex-row-reverse font-[Vazirmatn]">
      
      {/* سایدبار راست */}
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
            <span className="font-bold">تاریخ عضویت:</span>{" "}
            {new Date(userData.created_at).toLocaleDateString("fa-IR")}
          </p>
        </div>

        <nav className="flex flex-col gap-3 mt-4 w-full text-right">
          <button className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded">
            آگهی‌های من
          </button>
          <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded">
            افزودن آگهی
          </button>
          <button className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded">
            فیلترها
          </button>
        </nav>
      </aside>

      {/* بخش اصلی سمت چپ */}
      <main className="flex-1 p-6 space-y-6">
        <SendLink onSend={handleSendLink} />
        <AdsTable ads={ads} />
      </main>
    </div>
  );
}
