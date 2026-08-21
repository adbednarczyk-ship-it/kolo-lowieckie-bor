import { About } from "@/components/About";
import { Board } from "@/components/Board";
import { Contact } from "@/components/Contact";
import { Events } from "@/components/Events";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";
import { getPublicContent } from "@/lib/cms";

export default async function Home() {
  const { settings, boardMembers, galleryItems, newsPosts } =
    await getPublicContent();

  return (
    <main id="tresc">
      <Hero settings={settings} />
      <About settings={settings} />
      <Board members={boardMembers} />
      <Events />
      <Gallery items={galleryItems} />
      <News posts={newsPosts} />
      <Contact settings={settings} />
    </main>
  );
}
