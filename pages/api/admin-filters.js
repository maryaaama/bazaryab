import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
export default async function handler(req, res) {
  const userRole = req.headers['x-user-role']
  const userId = req.headers['x-user-id']

  // ادمین فیلتر اضافه می‌کند
  if (req.method === 'POST') {
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { search_url } = req.body
    if (!search_url) {
      return res.status(400).json({ error: 'search_url لازم است' })
    }

    const { data, error } = await supabase
      .from('admin_filters')
      .insert([
        {
          admin_id: userId,
          filter_name: 'فیلتر جدید',
          search_url,
          is_active: true,
        },
      ])

    if (error) return res.status(500).json({ error })
    return res.status(200).json({ data })
  }

  // همه کاربران فقط می‌خوانند
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admin_filters')
      .select('id, filter_name, search_url, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error })
    return res.status(200).json({ data })
  }

  res.status(405).end()
}
