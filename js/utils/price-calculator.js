// Date and price helpers. Dates are 'YYYY-MM-DD' strings (what <input type="date"> gives us).

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => inrFormatter.format(amount);

/** Today's date as local 'YYYY-MM-DD' (avoids UTC off-by-one from toISOString). */
export function getTodayString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Returns the day after a 'YYYY-MM-DD' date, as 'YYYY-MM-DD'. */
export function addOneDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  const pad = (n) => String(n).padStart(2, "0");
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
}

/** Calendar-day difference (return - pickup). Returns 0 if incomplete or not positive. */
export function calculateRentalDays(pickupStr, returnStr) {
  if (!pickupStr || !returnStr) return 0;
  const [py, pm, pd] = pickupStr.split("-").map(Number);
  const [ry, rm, rd] = returnStr.split("-").map(Number);
  // Date.UTC avoids daylight-saving shifts affecting the day count.
  const days = Math.round((Date.UTC(ry, rm - 1, rd) - Date.UTC(py, pm - 1, pd)) / MS_PER_DAY);
  return days > 0 ? days : 0;
}

export const calculateTotal = (dailyPrice, days) => dailyPrice * days;

/** Formats 'YYYY-MM-DD' as e.g. '25 Nov 2026'. */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
