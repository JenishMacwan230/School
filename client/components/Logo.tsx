"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number; // optional size control
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div className={'flex items-center gap-5' }>
      <Image
        src="/logo.png"     // 🔥 place your image in /public/logo.png
        alt="Logo"
        width={size}
        height={size}
        className="rounded-md"
      />
      <span className="text-xl font-bold tracking-tight">
        R N Naik Sarvjanik High School
      </span>
    </div>
  );
}
