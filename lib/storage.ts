import { BillFormValues } from "./validation";

const STORAGE_KEY = "upi-splitter-form";

/** Saves the current form state to localStorage. */
export function saveFormToStorage(values: Partial<BillFormValues>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // localStorage may be unavailable (private browsing, storage quota)
    // Silently ignore — this is a non-critical enhancement
  }
}

/** Loads saved form state from localStorage. Returns null if nothing saved. */
export function loadFormFromStorage(): Partial<BillFormValues> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<BillFormValues>;
  } catch {
    return null;
  }
}

/** Clears saved form state from localStorage. */
export function clearFormStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
