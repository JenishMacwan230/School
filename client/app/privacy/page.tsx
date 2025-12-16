import type { Metadata } from "next";
import PrivacyPolicyPage from "./privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Campus() {
  return <PrivacyPolicyPage />;
}
