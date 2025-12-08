import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Management System",
  description: "A Next.js application with MongoDB integration for school management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
