"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  School,
  Info,
  UserRoundPen,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { id: "school", label: "School", Icon: School, gradient: "from-blue-500 to-indigo-500" },
  { id: "about", label: "About", Icon: Info, gradient: "from-pink-500 to-rose-500" },
  { id: "teachers", label: "Teachers", Icon: UserRoundPen, gradient: "from-green-500 to-teal-500" },
  { id: "students", label: "Students", Icon: GraduationCap, gradient: "from-amber-500 to-orange-500" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("school");

  // Close drawer with ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          
          {/* LEFT — LOGO */}
          <Logo />

          {/* RIGHT — DESKTOP MENU (only lg screens) */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive = active === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`relative px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition
                    ${isActive ? "text-white" : "text-slate-700 dark:text-slate-300"}
                  `}
                >
                  {/* Colorful gradient background when active */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavGradient"
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg`}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>

                </motion.button>
              );
            })}
          </div>

          {/* RIGHT — MOBILE + TABLET MENU BUTTON (below lg) */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-7 w-7 text-slate-800 dark:text-slate-200" />
          </button>

        </div>
      </nav>

      {/* MOBILE/TABLET DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* DRAWER */}
            <motion.aside
              className="fixed top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 shadow-xl z-50 p-6"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* CLOSE HEADER */}
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                </button>
              </div>

              {/* MENU ITEMS - COLORFUL */}
              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.Icon;
                  const isActive = active === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition
                        ${isActive
                          ? `text-white bg-gradient-to-r ${item.gradient} shadow-md`
                          : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
