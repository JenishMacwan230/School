import type { Metadata } from "next";
import ExploreCampusPage from "./campus";

export const metadata: Metadata = {
  title: "Our Campus ",
  description:
    "Learn about R. N. Naik Sarvajanik High School, our trust, history, and management.",
};

export default function Campus() {
  return <ExploreCampusPage />;
}
