// /pages/api/signin.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, user_role, user_color, created_at')
    .eq('username', username)
    .eq('password', password)
    .limit(1);

  if (error) {
    return res.status(500).json({ error: 'Database query failed' });
  }

  if (!users || users.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(200).json({ user: users[0] });
}
