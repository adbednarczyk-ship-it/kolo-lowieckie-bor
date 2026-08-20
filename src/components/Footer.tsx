import Link from "next/link";
import { club, navItems } from "@/data/content";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream/10 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3 text-gold">
            <Logo className="h-10 w-10" />
            <span>
              <span className="block font-serif text-xl text-cream">
                {club.name}
              </span>
              <span className="text-xs tracking-[0.2em] text-cream-muted uppercase">
                {club.pzl}
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream-muted">
            Gospodarka łowiecka, ochrona zwierzyny i etyka myśliwska od{" "}
            {club.founded} roku. Strona ma charakter informacyjny — polowania
            odbywają się wyłącznie zgodnie z prawem łowieckim.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-gold uppercase">
            Nawigacja
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/polityka-prywatnosci" className="hover:text-cream">
                Polityka prywatności
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-gold uppercase">
            Kancelaria
          </p>
          <address className="mt-4 space-y-2 text-sm not-italic text-cream-muted">
            <p>
              {club.address.line1}
              <br />
              {club.address.line2}
              <br />
              {club.address.postal} {club.address.city}
            </p>
            <p>
              <a href={`mailto:${club.email}`} className="hover:text-cream">
                {club.email}
              </a>
              <br />
              <a
                href={`tel:${club.phone.replace(/\s/g, "")}`}
                className="hover:text-cream"
              >
                {club.phone}
              </a>
            </p>
            <p>{club.hours}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-cream-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {club.name}. Wszelkie prawa zastrzeżone.
          </p>
          <p>Projekt gotowy do wdrożenia · Next.js + Vercel</p>
        </div>
      </div>
    </footer>
  );
}
