import type { Metadata } from "next";
import { NewsForm } from "../NewsForm";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Nowy wpis",
  robots: { index: false, follow: false },
};

export default async function NewNewsPage() {
  await requireAdmin();
  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="mb-8 font-serif text-4xl text-cream">Nowy wpis</h1>
        <NewsForm />
      </div>
    </main>
  );
}
