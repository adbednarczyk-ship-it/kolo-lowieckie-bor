import Link from "next/link";

const links = [
  { href: "/admin", label: "Start" },
  { href: "/admin/tresc", label: "Treść strony" },
  { href: "/admin/zarzad", label: "Zarząd" },
  { href: "/admin/galeria", label: "Galeria" },
  { href: "/admin/aktualnosci", label: "Aktualności" },
  { href: "/admin/uzytkownicy", label: "Użytkownicy" },
  { href: "/admin/wydarzenia", label: "Zbiórki" },
  { href: "/szkody", label: "Szkody" },
] as const;

export function AdminNav() {
  return (
    <nav className="mb-10 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-cream/15 px-4 py-2 text-[11px] tracking-[0.16em] text-cream-muted uppercase hover:border-gold hover:text-gold"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
