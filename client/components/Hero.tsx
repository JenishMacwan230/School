"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const backgrounds = [
  "one.avif",
  "rn3.jpeg",
  "rn.jpg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  return (
    <section className="relative h-screen overflow-hidden pt-30">
      {/* 🔹 Sliding background images */}
      {backgrounds.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-5000 ${
            index === current ? "opacity-80" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* 🔹 Dark overlay (same as before) */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 🔹 CONTENT (UNCHANGED) */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 text-center text-white">
        <Badge className="mb-6 bg-white/20 text-white backdrop-blur-md">
          🎓 Welcome to Our School
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Choose the Best 
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
          Be the Best
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-bold text-white/90">
          We nurture young minds with quality education, strong values,
          and a vision for a brighter future.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-slate-900 hover:font-bold"
             onClick={() => router.push("/campus")}
          >
            Explore School Campus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-slate-900 hover:bg-white hover:text-slate-900 hover:font-bold"
            onClick={() => router.push("/admission")}
          >
            Admission Inquiry
          </Button>
        </div>
      </div>
    </section>
  );
}
