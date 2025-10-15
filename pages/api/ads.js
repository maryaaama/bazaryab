// pages/api/ads.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // از env درست
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // کلید سرویس

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Missing Supabase credentials" });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("ads")
      .select("id ,title, info, location, url")
      .limit(22);

    if (error) throw error;

    const numbered = data.map((item, idx) => ({
      row_number: idx + 1,
      ...item,
    }));

    res.status(200).json(numbered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
