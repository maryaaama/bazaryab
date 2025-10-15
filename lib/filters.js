// lib/filters.js
export const filterByLocation = (ads, location) => {
  if (!location?.trim()) return ads;

  const loc = location.toLowerCase().trim();
  return ads.filter(ad =>
    ad.location?.toLowerCase().trim().includes(loc)
  );
};

// فیلتر بازه قیمت (دقیق و ایمن در برابر رشته‌ها)
export const filterByPriceRange = (ads, from, to) => {
  let filtered = [...ads];
  const fromNum = Number(from);
  const toNum = Number(to);

  filtered = filtered.filter(ad => {
    const priceNum = Number(ad.price?.replace(/[^\d]/g, ""));
    if (isNaN(priceNum)) return false;
    if (fromNum && priceNum < fromNum) return false;
    if (toNum && priceNum > toNum) return false;
    return true;
  });

  return filtered;
};

// فیلتر وضعیت — مقایسه دقیق و بدون حساسیت به زبان یا فاصله
export const filterByStatus = (ads, status) => {
  if (!status?.trim()) return ads;

  const st = status.toLowerCase().trim();
  return ads.filter(ad =>
    String(ad.status).toLowerCase().trim() === st
  );
};

// فیلتر آگهی‌های من — تضمین تطبیق نوع داده بین seen_by و userId
export const filterMyAds = (ads, userId, showMyAds) => {
  if (!showMyAds || !userId) return ads;

  return ads.filter(ad => {
    // اگر فیلد دیده‌شده خالی یا نامعتبره، حذفش
    const seenRaw = ad.seen_by;
    if (!seenRaw || seenRaw.length === 0) return false;

    // پاک‌سازی و یکتا کردن مقادیر
    const cleaned = [...new Set(
      (Array.isArray(seenRaw) ? seenRaw : [seenRaw])
        .map(id => String(id).trim())
        .filter(id => id && id !== 'null' && id !== 'undefined')
    )];

    // تطبیق دقیق شناسۀ کاربر فعلی
    return cleaned.includes(String(userId).trim());
  });
};



// 🧩 تابع تجمیعی برای جلوگیری از تداخل فیلترها
export const applyAllFilters = (
  ads,
  { location, from, to, status, userId, showMyAds }
) => {
  let result = [...ads];

  // اول فیلترهای عمومی
  result = filterByStatus(result, status);
  result = filterByPriceRange(result, from, to);
  result = filterByLocation(result, location);

  // در نهایت فیلتر آگهی‌های من
  result = filterMyAds(result, userId, showMyAds);

  return result;
};
