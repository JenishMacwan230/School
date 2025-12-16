import type { Metadata } from "next";
import TermsPage from "./terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Terms() {
  return <TermsPage />;
}
