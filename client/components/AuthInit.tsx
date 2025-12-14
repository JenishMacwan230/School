'use client';

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function AuthInit() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
}
