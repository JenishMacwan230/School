"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>You are logged in as SUPER ADMIN</p>
    </div>
  );
}
