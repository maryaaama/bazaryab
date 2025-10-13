"use client";
import React from "react";

export default function AdsTable({ ads }) {
  return (
    <div className="overflow-x-auto bg-gradient-to-b from-[#050010] to-[#0a0220] px-4 pb-6 pt-4 rounded-xl shadow-lg border border-cyan-500/40">
      <table className="min-w-full text-sm text-gray-200 font-[Vazirmatn]">
        <thead>
          <tr className="text-cyan-300 border-b border-cyan-500">
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">عنوان</th>
            <th className="px-3 py-2">توضیحات</th>
            <th className="px-3 py-2">موقعیت</th>
            <th className="px-3 py-2">لینک</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr
              key={ad.url}
              className="hover:bg-cyan-900/30 transition-colors border-b border-gray-700"
            >
              <td className="px-3 py-2 text-pink-300 font-bold">{ad.row_number}</td>
              <td className="px-3 py-2">{ad.title}</td>
              <td className="px-3 py-2">{ad.info}</td>
              <td className="px-3 py-2">{ad.location}</td>
              <td className="px-3 py-2">
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  مشاهده
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
