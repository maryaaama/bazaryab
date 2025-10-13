// pages/api/update_seen.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { adUrl, seenBy, ownerColor } = req.body;

  console.log("🔹 دریافت از فرانت برای seen:", { adUrl, seenBy, ownerColor });

  try {
    // اعتبارسنجی UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validSeenBy = uuidRegex.test(seenBy) ? seenBy : null;

    const { error } = await supabase
      .from("ads_full")
      .update({
        ...(validSeenBy && { seen_by: validSeenBy }),
        ...(ownerColor && { owner_color: ownerColor }),
      })
      .eq("ad_url", adUrl);

    if (error) {
      console.error("🔥 Supabase update error (seen):", error);
      return res.status(500).json({ success: false, error });
    }

    console.log("✅ آپدیت موفق seen برای آگهی:", adUrl);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Server error (seen):", err);
    return res.status(500).json({ success: false, error: err });
  }
}
