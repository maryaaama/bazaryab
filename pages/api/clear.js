// pages/api/clear.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // مهم: Service Role Key
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // شرطی که همیشه درست هست — id غیر null
    const { error } = await supabase
      .from("ads")
      .delete()
      .not("id", "is", null); // هم شرط داره، هم به UUID کاری نداره

    if (error) throw error;

    return res.status(200).json({ message: "✅ همه رکوردها حذف شدند" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
