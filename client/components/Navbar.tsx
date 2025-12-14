"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  School,
  Info,
  UserRoundPen,
  GraduationCap,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useAuthStore } from "@/store/auth";

/* ---------------- NAV ITEMS (STATIC) ---------------- */
const navItems = [
  {
    id: "school",
    label: "School",
    Icon: School,
    gradient: "from-teal-600 to-cyan-600",
    path: "/",
  },
  {
    id: "about",
    label: "About",
    Icon: Info,
    gradient: "from-pink-500 to-rose-500",
    path: "/about",
  },
  {
    id: "teachers",
    label: "Teachers",
    Icon: UserRoundPen,
    gradient: "from-green-500 to-teal-500",
    path: "/teachers",
  },
  {
    id: "students",
    label: "Students",
    Icon: GraduationCap,
    gradient: "from-amber-500 to-orange-500",
    path: "/students",
  },
];

export default function Navbar() {
  const router = useRouter();
  const { user, openLogin, logout } = useAuthStore();

  
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("school");
  const [isScrolled, setIsScrolled] = useState(false);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- ESC TO CLOSE DRAWER ---------------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={cn(
          "w-full fixed z-20 transition-colors duration-300",
          isScrolled ? "bg-transparent" : "bg-white dark:bg-slate-900"
        )}
      >
        <div
          className={cn(
            "max-w-7xl  h-20 mx-auto mt-2 flex items-center justify-between px-4 transition-all duration-300",
            isScrolled &&
              "bg-background/60 max-w-6xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          {/* LOGO */}
          <Logo />

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive = active === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    router.push(item.path);
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "relative px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition",
                    isActive
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavGradient"
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r rounded-xl shadow-lg",
                        item.gradient
                      )}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </motion.button>
              );
            })}

            {/* -------- AUTH BUTTON (DESKTOP) -------- */}
            {!user ? (
              <motion.button
                onClick={openLogin}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-400 to-purple-400 text-white"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            ) : (
              <motion.button
                onClick={async () => {
                  await logout();
                  router.replace("/");
                }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-red-600 bg-gradient-to-r from-red-100 to-red-200"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Logout
              </motion.button>
            )}
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-7 w-7 text-slate-800 dark:text-slate-200" />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
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
              className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-slate-900 shadow-xl z-50 p-6"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* HEADER */}
              <div className="flex items-start justify-between mb-8 gap-3">
                <Logo showFullOnMobile className="items-center text-center" />
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* MENU ITEMS */}
              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setOpen(false);
                        router.push(item.path);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}

                {/* -------- AUTH BUTTON (MOBILE) -------- */}
                {!user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                       openLogin();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                      router.replace("/");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg text-red-600"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                    Logout
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
