import Hero from "@/components/Hero";
import {SecTwo} from "@/components/SecTwo";
import {FAQs} from "@/components/FAQ";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
    <Hero/>
    <Separator/>
    <SecTwo/>
     <Separator/>
    <FAQs/>
    </>
  );
}
