import type { Metadata } from "next";
import { SettingsForm } from "./SettingsForm";
import { AdminNav } from "@/components/AdminNav";
import { getSiteSettings } from "@/lib/cms";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Treść strony",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="font-serif text-4xl text-cream">Treść strony</h1>
        <p className="mt-4 mb-10 text-cream-muted">
          Zmiany widać na stronie głównej po zapisaniu.
        </p>
        <SettingsForm settings={settings} />
      </div>
    </main>
  );
}
