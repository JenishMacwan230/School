import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import AuthInit from "@/components/AuthInit";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "R. N. Naik Sarvajanik High School",
    template: "%s | R. N. Naik Sarvajanik High School",
  },
  description: "R. N. Naik Sarvajanik High School, Sarikhurad",
  icons: {
    icon: [
      { url: "/RNL.png", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/RNL.png", sizes: "512x512", type: "image/png" },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInit>
          <Navbar />
          <LoginModal />
          {children}

          <Footer />
        </AuthInit>

      </body>
    </html>
  );
}
