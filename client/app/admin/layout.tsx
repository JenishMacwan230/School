'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      // ✅ FIXED ROLE CHECK
      if (user.role !== "SUPER_ADMIN") {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || user.role !== "SUPER_ADMIN") return null;

  return <>{children}</>;
}
