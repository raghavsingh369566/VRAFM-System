// Reusable LocalStorage helpers.
// NOTE: LocalStorage is fine for a frontend demo but is NOT secure or
// suitable as a production database.
const BOOKINGS_KEY = "vrafm_bookings";

/** Returns the saved bookings array. Never throws; bad data yields []. */
export function getBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((b) => b && typeof b === "object") : [];
  } catch (error) {
    console.warn("Could not read bookings from LocalStorage:", error);
    return [];
  }
}

/** Appends a booking without overwriting existing ones. Returns true on success. */
export function saveBooking(booking) {
  try {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error("Could not save booking:", error);
    return false;
  }
}

/** Returns the most recently created booking, or null. */
export function getLatestBooking() {
  const bookings = getBookings();
  if (bookings.length === 0) return null;
  return bookings.reduce((latest, b) =>
    new Date(b.createdAt || 0) >= new Date(latest.createdAt || 0) ? b : latest
  );
}

/** Generates a unique ID like VR-2026-48213 (checked against saved IDs). */
export function generateBookingId() {
  const year = new Date().getFullYear();
  const existing = new Set(getBookings().map((b) => b.bookingId));
  let id;
  do {
    const suffix = String(Math.floor(10000 + Math.random() * 90000));
    id = `VR-${year}-${suffix}`;
  } while (existing.has(id));
  return id;
}
