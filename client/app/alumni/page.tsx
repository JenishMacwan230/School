import type { Metadata } from "next";
import AlumniPage from "./Alumni";

export const metadata: Metadata = {
  title: "Alumni ",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Alumni() {
  return <AlumniPage />;
}
