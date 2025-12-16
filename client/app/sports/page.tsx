import type { Metadata } from "next";
import SportsPage from "./sports";

export const metadata: Metadata = {
  title: "Sports",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Sports() {
  return <SportsPage />;
}
