export type TravelerApplication = {
  id: string;
  projectId: number;
  projectTitle: string;
  travelerName: string;
  city: string;
  age: string;
  about: string;
  skills: string;
  photoDataUrl: string;
  createdAt: string;
};

const STORAGE_KEY = "travel_applications_v1";

export function readApplications(): TravelerApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TravelerApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveApplication(item: TravelerApplication) {
  if (typeof window === "undefined") return;
  const current = readApplications();
  current.unshift(item);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

