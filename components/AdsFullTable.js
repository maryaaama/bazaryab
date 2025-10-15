"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdsFullTable({ ads, userId, username, userRole, userColor }) {
  const [localAds, setLocalAds] = useState(ads);
  const [usersList, setUsersList] = useState([]);

  // دریافت لیست کاربران از API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsersList(data);
      } catch (err) {
        console.error("خطا در دریافت کاربران:", err);
      }
    };
    fetchUsers();
  }, []);
 // ✅ همگام‌سازی جدول با داده‌های جدید فیلترشده از Dashboard
    useEffect(() => {
    setLocalAds(ads);
   }, [ads]);

  // تغییر وضعیت آگهی
  const handleStatusChange = async (adUrl, newStatus) => {
    const validStatuses = ["new", "contacted", "interested", "closed"];
    if (!validStatuses.includes(newStatus)) {
      console.error("🚫 وضعیت نامعتبر:", newStatus);
      return;
    }

    const seenBy = userId;
    const ownerColor = usersList.find((u) => u.id === seenBy)?.user_color || null;

    try {
      const res = await axios.post("/api/update_status", {
        adUrl,
        newStatus,
        seenBy,
        ownerColor,
      });

      if (res.data.success) {
        setLocalAds((prev) =>
          prev.map((ad) =>
            ad.url === adUrl
              ? { ...ad, status: newStatus, seen_by: seenBy, owner_color: ownerColor }
              : ad
          )
        );
      }
    } catch (err) {
      console.error("🔥 خطا در آپدیت وضعیت:", err);
    }
  };

  // وقتی شماره تماس اضافه می‌شود
  const handleSeenByOnPhoneAdd = async (adUrl, newPhone) => {
    const seenBy = userId;
    const ownerColor = usersList.find((u) => u.id === seenBy)?.user_color || null;

    try {
      const res = await axios.post("/api/update_status", {
        adUrl,
        newStatus:"contacted",
        seenBy,
        ownerColor,
      });

      if (res.data.success) {
        setLocalAds((prev) =>
          prev.map((ad) =>
            ad.url === adUrl
              ? {
                  ...ad,
                  phone_number: newPhone,
                  seen_by: seenBy,
                  status: "contacted",
                  owner_color: ownerColor,
                }
              : ad
          )
        );
      }
    } catch (err) {
      console.error("🔥 خطا در آپدیت شماره تماس:", err);
    }
  };

  // انتخاب کاربر مسئول دیده‌شدن
  const handleUserSelection = async (adUrl, usernameSelected) => {
    const selectedUser = usersList.find((u) => u.username === usernameSelected);
    if (!selectedUser) return;

    const seenBy = selectedUser.id;
    const ownerColor = selectedUser.user_color;

    try {
      const res = await axios.post("/api/update_status", {
        adUrl,
        newStatus: "new",
        seenBy,
        ownerColor,
      });

      if (res.data.success) {
        setLocalAds((prev) =>
          prev.map((ad) =>
            ad.url === adUrl
              ? {
                  ...ad,
                  seen_by: seenBy,
                  owner_color: ownerColor,
                  status: "new",
                }
              : ad
          )
        );
      }
    } catch (err) {
      console.error("🔥 خطا در ثبت یوزرنیم دیده شده:", err);
    }
  };

  // JSX ریسپانسیو
  return (
    <div className="overflow-x-auto bg-gradient-to-b from-[#050010] to-[#0a0220] p-4 sm:p-5 rounded-2xl shadow-xl border border-cyan-500/40 font-[Vazirmatn] text-gray-200">
      {/* حالت دسکتاپ */}
      <table className="hidden sm:table min-w-full text-lg border-collapse">
        <thead>
          <tr className="text-gray-300 border-b border-cyan-700/40">
            <th className="px-3 py-3 text-center">#</th>
            <th className="px-3 py-3 text-left">عنوان</th>
            <th className="px-3 py-3 text-left">توضیحات</th>
            <th className="px-3 py-3 text-left">موقعیت</th>
            <th className="px-3 py-3 text-right">قیمت</th>
            <th className="px-3 py-3 text-center">وضعیت</th>
            <th className="px-3 py-3 text-center">شماره تماس</th>
            <th className="px-3 py-3 text-center">دیده‌شده توسط</th>
            <th className="px-3 py-3 text-center">لینک آگهی</th>
          </tr>
        </thead>

        <tbody>
          {localAds.map((ad, index) => (
            <tr
              key={ad.id}
              className="hover:bg-[#0d0f20] transition-colors border-b border-gray-700/40"
            >
              <td className="px-3 py-2 text-center text-gray-400 font-semibold">
                {ad.row_number || index + 1}
              </td>

              {/* 🎨 رنگ عنوان بر اساس owner_color */}
              <td
                className="px-3 py-2 font-semibold"
                style={{
                  color:
                    ad.seen_by === userId
                      ? userColor
                      : ad.owner_color || "#e5e7eb",
                }}
              >
                {ad.title || "—"}
              </td>

              <td className="px-3 py-2">{ad.info || "—"}</td>
              <td className="px-3 py-2">{ad.location || "—"}</td>

              <td className="px-3 py-2 text-right font-semibold">
                {ad.price ? `${ad.price.toLocaleString()} تومان` : "—"}
              </td>

              <td className="px-3 py-2 text-center">
                <select
                  value={ad.status || "new"}
                  onChange={(e) => handleStatusChange(ad.url, e.target.value)}
                  className="bg-transparent text-pink-400 border border-cyan-600 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="new">جدید</option>
                  <option value="contacted">تماس گرفته</option>
                  <option value="interested">علاقه‌مند</option>
                  <option value="closed">بسته</option>
                </select>
              </td>

              <td className="px-3 py-2 text-center">
                <input
                  type="text"
                  defaultValue={ad.phone_number || ""}
                  onBlur={(e) => handleSeenByOnPhoneAdd(ad.url, e.target.value.trim())}
                  placeholder="شماره..."
                  className="bg-transparent border border-gray-600 rounded px-2 py-1 text-gray-200 text-center w-32 focus:outline-none"
                />
              </td>

              <td className="px-3 py-2 text-center">
                <select
                  value={usersList.find((u) => u.id === ad.seen_by)?.username || ""}
                  onChange={(e) => handleUserSelection(ad.url, e.target.value)}
                  className="bg-transparent text-gray-200 border border-gray-500 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="">انتخاب کاربر</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-3 py-2 text-center">
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                >
                  مشاهده
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* حالت موبایل (Card view) */}
      <div className="sm:hidden space-y-3">
        {localAds.map((ad, index) => (
          <div
            key={ad.id}
            className="border border-gray-700/40 rounded-xl p-3 bg-[#070014] shadow-lg"
          >
            <div className="flex justify-between mb-2 text-sm text-gray-400">
              <span>آگهی #{index + 1}</span>
              <span>{ad.status || "جدید"}</span>
            </div>

            <h3
              className="font-semibold text-base mb-1"
              style={{
                color:
                  ad.seen_by === userId
                    ? userColor
                    : ad.owner_color || "#e5e7eb",
              }}
            >
              {ad.title || "—"}
            </h3>

            <p className="text-gray-300 mb-2 text-sm">{ad.info || "—"}</p>
            <p className="text-gray-400 text-xs mb-2">
              📍 {ad.location || "—"}
            </p>

            <p className="text-gray-200 font-medium mb-3">
              💰 {ad.price ? `${ad.price.toLocaleString()} تومان` : "—"}
            </p>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                defaultValue={ad.phone_number || ""}
                onBlur={(e) => handleSeenByOnPhoneAdd(ad.url, e.target.value.trim())}
                placeholder="شماره تماس"
                className="bg-transparent border border-gray-600 rounded px-2 py-1 text-gray-200 text-center focus:outline-none text-sm"
              />

              <select
                value={usersList.find((u) => u.id === ad.seen_by)?.username || ""}
                onChange={(e) => handleUserSelection(ad.url, e.target.value)}
                className="bg-transparent text-gray-200 border border-gray-600 rounded px-2 py-1 focus:outline-none text-sm"
              >
                <option value="">انتخاب کاربر</option>
                {usersList.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username}
                  </option>
                ))}
              </select>

              <select
                value={ad.status || "new"}
                onChange={(e) => handleStatusChange(ad.url, e.target.value)}
                className="bg-transparent text-gray-200 border border-gray-600 rounded px-2 py-1 focus:outline-none text-sm"
              >
                <option value="new">جدید</option>
                <option value="contacted">تماس گرفته</option>
                <option value="interested">مشتاق</option>
                <option value="closed">بسته</option>
              </select>

              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 underline text-sm text-center"
              >
                مشاهده آگهی 🔗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
