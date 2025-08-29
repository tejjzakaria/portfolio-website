"use client";
import React from "react";
import { SidebarLink } from "./ui/SideBar";
import { useRouter } from "next/navigation";

// Reuse the LogoutLink from SideBarNav
import { LogoutLink } from "./SideBarNav";

export function UserProfileSidebar() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        // Debug log to see what is returned
        console.log("[UserProfileSidebar] /api/auth/session response:", data);
        setUser(data.user || data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-neutral-700" />
        <div className="h-4 w-24 rounded bg-neutral-700" />
      </div>
    );
  }

  // Show error if user is not found
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <span>User not found</span>
        <LogoutLink />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <SidebarLink
        link={{
          label: user.name || user.email || "User",
          role: user.role || user.type || "Role",
          href: "",
          icon: (
            <img
              src={user.image || user.avatar || "/avatar.png"}
              className="h-10 w-10 object-cover shrink-0 rounded-full"
              alt="Avatar"
            />
          ),
        }}
      />
      <LogoutLink />
    </div>
  );
}
