import { About } from "@/components/About";
import { Board } from "@/components/Board";
import { Contact } from "@/components/Contact";
import { Events } from "@/components/Events";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";
import { getPublicContent } from "@/lib/cms";

export default async function Home() {
  const { settings, boardMembers, galleryAlbums, newsPosts } =
    await getPublicContent();

  return (
    <main id="tresc">
      <Hero settings={settings} />
      <About settings={settings} />
      <Board members={boardMembers} />
      <Events />
      <Gallery albums={galleryAlbums} />
      <News posts={newsPosts} />
      <Contact settings={settings} />
    </main>
  );
}
