import Image from "next/image";
import Navbar from "@/components/Navbar";
import {Logo} from "@/components/Logo";


export default function Home() {
  return (
    <div className="flex mt-10 items-center justify-center  font-sans dark:bg-black">
     
      <Navbar/>
    </div>
  );
}
