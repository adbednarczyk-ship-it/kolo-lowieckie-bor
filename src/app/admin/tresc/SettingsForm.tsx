"use client";

import { useActionState } from "react";
import { saveSiteSettings, type CmsState } from "../cms-actions";
import { type SiteSettings } from "@/types/cms";

const field =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<CmsState, FormData>(
    saveSiteSettings,
    undefined,
  );

  return (
    <form action={action} className="space-y-12">
      <input type="hidden" name="current_hero_image" value={settings.hero_image} />
      <section className="border border-cream/10 p-6">
        <h2 className="font-serif text-2xl text-cream">Hero (góra strony)</h2>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Krótka linia nad nagłówkiem</span>
          <input name="hero_eyebrow" defaultValue={settings.hero_eyebrow} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Nagłówek</span>
          <input name="hero_headline" defaultValue={settings.hero_headline} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Krótki tekst</span>
          <textarea name="hero_text" rows={3} defaultValue={settings.hero_text} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Nowe zdjęcie tła</span>
          <input type="file" name="image" accept="image/*" className="text-cream-muted" />
        </label>
        <label className="mt-3 block text-sm">
          <span className="mb-2 block text-cream-muted">albo adres URL zdjęcia</span>
          <input name="image_url" defaultValue={settings.hero_image} className={field} />
        </label>
      </section>

      <section className="border border-cream/10 p-6">
        <h2 className="font-serif text-2xl text-cream">O nas</h2>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Tytuł</span>
          <input name="about_title" defaultValue={settings.about_title} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Wstęp</span>
          <textarea name="about_intro" rows={4} defaultValue={settings.about_intro} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Misja</span>
          <textarea name="about_mission" rows={3} defaultValue={settings.about_mission} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Dłuższy tekst</span>
          <textarea name="about_body" rows={5} defaultValue={settings.about_body} className={field} />
        </label>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Podpis pod zdjęciem</span>
          <input name="about_caption" defaultValue={settings.about_caption} className={field} />
        </label>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <input
                name={`pillar${n}_title`}
                defaultValue={settings[`pillar${n}_title` as keyof SiteSettings]}
                placeholder="Tytuł filaru"
                className={field}
              />
              <textarea
                name={`pillar${n}_text`}
                rows={4}
                defaultValue={settings[`pillar${n}_text` as keyof SiteSettings]}
                className={`${field} mt-3`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-4">
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Rok</span>
            <input name="stat_founded" defaultValue={settings.stat_founded} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Powierzchnia</span>
            <input name="stat_area" defaultValue={settings.stat_area} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Członkowie</span>
            <input name="stat_members" defaultValue={settings.stat_members} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Numer obwodu</span>
            <input name="stat_plot" defaultValue={settings.stat_plot} className={field} />
          </label>
        </div>
      </section>

      <section className="border border-cream/10 p-6">
        <h2 className="font-serif text-2xl text-cream">Kontakt</h2>
        <label className="mt-5 block text-sm">
          <span className="mb-2 block text-cream-muted">Nazwa koła</span>
          <input name="club_name" defaultValue={settings.club_name} className={field} />
        </label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">E-mail</span>
            <input name="email" defaultValue={settings.email} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Telefon</span>
            <input name="phone" defaultValue={settings.phone} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Adres 1</span>
            <input name="address_line1" defaultValue={settings.address_line1} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Adres 2</span>
            <input name="address_line2" defaultValue={settings.address_line2} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Kod</span>
            <input name="postal" defaultValue={settings.postal} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Miejscowość</span>
            <input name="city" defaultValue={settings.city} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Godziny kancelarii</span>
            <input name="hours" defaultValue={settings.hours} className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-cream-muted">Okręg PZŁ</span>
            <input name="pzl" defaultValue={settings.pzl} className={field} />
          </label>
        </div>
      </section>

      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz treść"}
      </button>
    </form>
  );
}
