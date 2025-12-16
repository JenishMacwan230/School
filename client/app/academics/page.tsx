import type { Metadata } from "next";
import AcademicsPage from "./Academics";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Academics() {
  return <AcademicsPage />;
}
