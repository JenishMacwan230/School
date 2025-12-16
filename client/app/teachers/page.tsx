import type { Metadata } from "next";
import TeachersPage from "./Teachers";

export const metadata: Metadata = {
  title: "Our Teachers ",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Campus() {
  return <TeachersPage />;
}
