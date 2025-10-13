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
    <div className="w-full p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-500 shadow-[0_0_12px_#00ffff55]">
      <h2 className="text-2xl font-bold text-cyan-400 mb-3">🔗 فیلترهای فعال دیوار</h2>

      {userRole === 'admin' && (
        <div className="flex gap-3 mb-5">
          <input
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-gray-900 text-cyan-300 border border-cyan-500 focus:outline-none"
            placeholder="لینک جستجو دیوار را وارد کنید..."
          />
          <button
            onClick={submitFilter}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
          >
            ➕ افزودن
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filters.map((f) => (
          <div
            key={f.id}
            className="p-3 bg-gray-800/50 border border-cyan-600 rounded-xl text-gray-200 shadow-[inset_0_0_6px_#00ffff55]"
          >
            <p className="text-sm">{f.search_url}</p>
            <p className="text-xs text-cyan-400 mt-1">
              {new Date(f.created_at).toLocaleString('fa-IR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
