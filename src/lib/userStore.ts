import { useEffect, useState } from "react";
import { currentUser as defaultUser, stokvel as defaultStokvel } from "./mockData";

const USER_KEY = "ubuntupay_user";
const STOKVEL_KEY = "ubuntupay_stokvel";
const PLAN_KEY = "ubuntupay_plan";
const VIEW_KEY = "ubuntupay_view"; // 'admin' | 'member'

type User = typeof defaultUser;
type Stokvel = typeof defaultStokvel;
export type ViewRole = "admin" | "member";

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const emit = (key: string) => window.dispatchEvent(new CustomEvent(`store:${key}`));

export const getUser = (): User => read(USER_KEY, defaultUser);
export const saveUser = (patch: Partial<User>) => {
  const next = { ...getUser(), ...patch };
  if (patch.name) next.initials = initials(patch.name);
  localStorage.setItem(USER_KEY, JSON.stringify(next));
  emit(USER_KEY);
  return next;
};

export const getStokvel = (): Stokvel => read(STOKVEL_KEY, defaultStokvel);
export const saveStokvel = (patch: Partial<Stokvel>) => {
  const next = { ...getStokvel(), ...patch };
  localStorage.setItem(STOKVEL_KEY, JSON.stringify(next));
  emit(STOKVEL_KEY);
  return next;
};

export const getPlan = (): string => localStorage.getItem(PLAN_KEY) || "Standard";
export const savePlan = (name: string) => {
  localStorage.setItem(PLAN_KEY, name);
  emit(PLAN_KEY);
};

export const getView = (): ViewRole =>
  (localStorage.getItem(VIEW_KEY) as ViewRole) || "admin";
export const saveView = (v: ViewRole) => {
  localStorage.setItem(VIEW_KEY, v);
  emit(VIEW_KEY);
};

const useStore = <T,>(key: string, getter: () => T): T => {
  const [val, setVal] = useState<T>(getter);
  useEffect(() => {
    const handler = () => setVal(getter());
    window.addEventListener(`store:${key}`, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(`store:${key}`, handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return val;
};

export const useUser = () => useStore(USER_KEY, getUser);
export const useStokvel = () => useStore(STOKVEL_KEY, getStokvel);
export const usePlan = () => useStore(PLAN_KEY, getPlan);
export const useView = () => useStore(VIEW_KEY, getView);
export const useIsAdmin = () => useView() === "admin";
