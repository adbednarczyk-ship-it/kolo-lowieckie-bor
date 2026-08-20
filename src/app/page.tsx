import { About } from "@/components/About";
import { Board } from "@/components/Board";
import { Contact } from "@/components/Contact";
import { Events } from "@/components/Events";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";

export default function Home() {
  return (
    <main id="tresc">
      <Hero />
      <About />
      <Board />
      <Events />
      <Gallery />
      <News />
      <Contact />
    </main>
  );
}
