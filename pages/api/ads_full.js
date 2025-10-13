// pages/api/ads_full.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Missing Supabase credentials" });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ستون‌ها را کامل انتخاب می‌کنیم
    const { data, error } = await supabase
      .from("ads_full")
      .select("title, info, location, price, status, phone_number, seen_by, url")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) throw error;

    // شماره‌گذاری برای ردیف‌ها
    const numbered = data.map((item, idx) => ({
      row_number: idx + 1,
      ...item,
    }));

    res.status(200).json(numbered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
