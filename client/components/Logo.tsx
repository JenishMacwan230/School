"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showFullOnMobile?: boolean;
}

export function Logo({
  className,
  size = 50,
  showFullOnMobile = false,
}: LogoProps) {
  return (
    <div
      className={cn(
        "flex gap-4 min-w-0",
        showFullOnMobile
          ? "flex-col items-start sm:flex-row sm:items-center"
          : "flex-row items-center",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={size}
        height={size}
        className="rounded-md shrink-0"
      />

      {/* TEXT */}
      <div className="min-w-0">
        {/* Mobile navbar closed */}
        {!showFullOnMobile && (
          <div className="block sm:hidden text-lg font-bold truncate">
            R. N. Naik Sarvajanik High School
          </div>
        )}

        {/* Desktop + Mobile Drawer */}
        <div
          className={cn(
            "hidden sm:block",
            showFullOnMobile && "block"
          )}
        >
          <div className="text-base md:text-lg font-bold leading-tight">
            R. N. Naik Sarvajanik High School &
          </div>
          <div className="text-base md:text-lg font-bold leading-tight">
            Bharat Darshan Uchchattar Madhyamik High School
          </div>
        </div>
      </div>
    </div>
  );
}
