import type { Metadata } from "next";
import AdmissionInquiryPage from "./Admission";

export const metadata: Metadata = {
  title: "Admissions ",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Admission() {
  return <AdmissionInquiryPage />;
}
