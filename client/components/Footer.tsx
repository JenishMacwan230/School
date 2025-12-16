"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ================= ICONS ================= */

const FacebookIcon = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.326v21.348c0 .732.593 1.326 1.325 1.326h11.495v-9.294h-3.13v-3.622h3.13v-2.671c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.505 0-1.796.716-1.796 1.765v2.311h3.587l-.467 3.622h-3.12v9.294h6.116c.73 0 1.323-.594 1.323-1.326v-21.35c0-.733-.593-1.326-1.325-1.326z" />
  </svg>
);

const InstagramIcon = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.75 2h8.5a5.75 5.75 0 015.75 5.75v8.5a5.75 5.75 0 01-5.75 5.75h-8.5a5.75 5.75 0 01-5.75-5.75v-8.5a5.75 5.75 0 015.75-5.75zm0 1.5a4.25 4.25 0 00-4.25 4.25v8.5a4.25 4.25 0 004.25 4.25h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zm4.25 3.25a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm5.5-.88a1.13 1.13 0 110 2.26 1.13 1.13 0 010-2.26z" />
  </svg>
);

const TwitterIcon = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
  </svg>
);

/* ================= FOOTER ================= */

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white py-12 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* ===== BRAND (35%) ===== */}
        <div className="lg:w-[35%] flex flex-col items-center justify-center text-center space-y-4">
          <Image
            src="/logo.png"
            alt="School Logo"
            width={90}
            height={90}
            className="rounded-md"
          />

          <div className="font-bold text-lg leading-tight">
            R. N. Naik Sarvajanik High School &<br />
            Bharat Darshan Uchchattar Madhyamik High School, Sarikhurad.
          </div>

          <div className="flex gap-6 pt-2 text-gray-600 dark:text-gray-300">
            <a href="https://www.facebook.com/rnnaikhighschoolsarikhurad/" className="hover:text-blue-600 transition">
              <FacebookIcon />
            </a>
            <a href="https://x.com/sarikhurad" className="hover:text-sky-500 transition">
              <TwitterIcon />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* ===== LINKS (65%) ===== */}
        <div className="lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/admission">Admission Inquiry</Link></li>
              <li><Link href="/academics">Academics</Link></li>
              <li><Link href="/campus">Our Campus</Link></li>
              <li><Link href="/sports">Sports</Link></li>
              <li><Link href="/alumni">Alumni</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              {/* <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/careers">Careers</Link></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>Gj Sh 704, Sarikhurd, Amalsad</p>
            <p>Navsari - 396310, Gujarat</p>
            <p>Email: rnnaikschool@gmail.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
          </div>

        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-6">
        © {new Date().getFullYear()} R. N. Naik Sarvajanik High School. All rights reserved.
        <br />
        Designed & developed with ❤️ by <strong>Jenish Macwan</strong>
      </div>
    </footer>
  );
};

export default Footer;
