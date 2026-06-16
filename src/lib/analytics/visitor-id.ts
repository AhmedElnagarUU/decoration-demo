import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";

const VISITOR_KEY = "dc_visitor_id";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  let id = getLocalStorageItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    setLocalStorageItem(VISITOR_KEY, id);
  }

  return id;
}
