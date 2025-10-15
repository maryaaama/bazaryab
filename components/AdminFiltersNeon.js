'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminFiltersNeon({ userRole, userId }) {
  const [filters, setFilters] = useState([])
  const [searchUrl, setSearchUrl] = useState('')

  const fetchFilters = async () => {
    try {
      const res = await axios.get('/api/admin-filters')
      setFilters(res.data.data)
    } catch (e) {
      console.error(e)
    }
  }

  const submitFilter = async () => {
    if (userRole !== 'admin') {
      alert('فقط ادمین می‌تواند فیلتر اضافه کند!')
      return
    }
    if (!searchUrl.trim()) {
      alert('لینک را وارد کنید')
      return
    }

    try {
      await axios.post(
        '/api/admin-filters',
        { search_url: searchUrl },
        { headers: { 'x-user-role': userRole, 'x-user-id': userId } }
      )
      setSearchUrl('')
      fetchFilters()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchFilters()
  }, [])

  return (
    <div className="w-full p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#050010] to-[#0a0220] backdrop-blur-md border border-cyan-500/50 shadow-lg sm:shadow-[0_0_12px_#00ffff55]">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">
        🔗 فیلترهای فعال دیوار
      </h2>

      {userRole === 'admin' && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-gray-900 text-gray-100 border border-cyan-500/70 focus:outline-none text-sm sm:text-base"
            placeholder="لینک جستجو دیوار را وارد کنید..."
          />
          <button
            onClick={submitFilter}
            className="px-4 sm:px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition text-sm sm:text-base"
          >
            ➕ افزودن
          </button>
        </div>
      )}

      {/* کارت‌ها برای فیلترها */}
      <div className="space-y-3 sm:space-y-2">
        {filters.map((f) => (
          <div
            key={f.id}
            className="p-3 bg-gray-800/40 border border-cyan-700/50 rounded-xl text-gray-200 shadow-inner hover:bg-gray-800/70 transition"
          >
            <p className="text-xs sm:text-sm break-all">{f.search_url}</p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
              {new Date(f.created_at).toLocaleString('fa-IR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
