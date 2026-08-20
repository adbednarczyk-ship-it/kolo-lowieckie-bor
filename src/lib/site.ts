export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kolo-lowieckie-bor.vercel.app";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${iso}T00:00:00`));
}
