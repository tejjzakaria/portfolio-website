"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (!session?.data?.user || session.data.user.role !== "admin") {
        router.replace("/login");
      }
    })();
  }, [router]);
  return <>{children}</>;
}
