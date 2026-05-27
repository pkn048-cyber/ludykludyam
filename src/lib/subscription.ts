const KEY = "ludi_sub_active";

// Промокоды для демо-доступа (в реальности заменяются на проверку через бэкенд)
const DEMO_CODES = ["LUDI2025", "START3M", "START1Y", "HOSTDEMO"];

export function getIsPaid(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function activateByCode(code: string): boolean {
  if (DEMO_CODES.includes(code.trim().toUpperCase())) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function deactivate(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
