// lib/usersFn.ts
export function getSavedUsers(): string[] {
    if (typeof window === "undefined") return []; // SSR safe
  
    const raw = localStorage.getItem("recent_users");
    return raw ? JSON.parse(raw) : [];
  }
  
  export function saveUser(username: string) {
    if (typeof window === "undefined") return;
  
    const users = getSavedUsers();
    const updated = [username, ...users.filter(u => u !== username)].slice(0, 3);
  
    localStorage.setItem("recent_users", JSON.stringify(updated));
  }
  