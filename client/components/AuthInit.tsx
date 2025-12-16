"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

type AuthInitProps = {
  children: React.ReactNode;
};

export default function AuthInit({ children }: AuthInitProps) {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}
