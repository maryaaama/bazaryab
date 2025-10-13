import { createClient } from "@supabase/supabase-js";
import { validate as isUuid } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ⬇️ اضافه شد: ownerColor
  const { adUrl, newStatus, seenBy, ownerColor } = req.body;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // ---- بررسی صحت ورودی‌ها ----
    if (!adUrl || !newStatus) {
      console.error("⚠️ adUrl یا newStatus خالی است:", { adUrl, newStatus });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // فقط مقادیر UUID معتبر پذیرفته می‌شوند
    const seenValue = isUuid(seenBy) ? seenBy : null;
    const ownerColorValue =
      typeof ownerColor === "string" && ownerColor.trim() !== ""
        ? ownerColor.trim()
        : null;

    console.log("🔹 دریافت از فرانت:", {
      adUrl,
      newStatus,
      seenBy,
      seenValue,
      ownerColorValue,
    });

    // ---- عملیات آپدیت ----
    const updatePayload = {
      status: newStatus,
      seen_by: seenValue,
    };

    // اگر رنگ کاربر در request بود، اضافه‌اش کن
    if (ownerColorValue) updatePayload.owner_color = ownerColorValue;

    const { data, error } = await supabase
      .from("ads_full")
      .update(updatePayload)
      .eq("url", adUrl)
      .select();

    if (error) {
      console.error("🔥 Supabase update error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ آپدیت موفق:", data);
    res.status(200).json({ success: true, updated: data });
  } catch (err) {
    console.error("💥 خطای سرور:", err);
    res.status(500).json({ error: err.message });
  }
}
