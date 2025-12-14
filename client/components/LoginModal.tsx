'use client';

import { useAuthStore } from '@/store/auth';
import Login3 from '@/app/login/page';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuthStore();

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLogin}
          />

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="relative w-full max-w-md">
              
              {/* ❌ CLOSE BUTTON */}
              <button
                onClick={closeLogin}
                className="absolute top-51 -right-5 z-10 bg-white dark:bg-black
                           rounded-full p-2 shadow hover:bg-gray-100
                           dark:hover:bg-gray-800 transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* LOGIN CARD */}
              <Login3 />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
