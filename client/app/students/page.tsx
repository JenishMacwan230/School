import type { Metadata } from "next";
import StudentsPage from "./students";

export const metadata: Metadata = {
  title: "Our students ",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function student() {
  return <StudentsPage />;
}
