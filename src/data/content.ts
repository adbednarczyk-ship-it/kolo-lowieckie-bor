export const club = {
  name: "Koło Łowieckie „Bór”",
  shortName: "Bór",
  fullLegalName: "Koło Łowieckie „Bór” przy Polskim Związku Łowieckim",
  founded: 1978,
  members: 42,
  areaHa: 8400,
  email: "kontakt@klbor.pl",
  phone: "+48 41 123 45 67",
  address: {
    line1: "Leśniczówka Bór",
    line2: "ul. Leśna 12",
    postal: "26-001",
    city: "Bór",
  },
  hours: "Wtorek i czwartek, 17:00–19:00",
  pzl: "Okręg Kielecki PZŁ",
} as const;

export const navItems = [
  { href: "/#o-nas", label: "O nas" },
  { href: "/#zarzad", label: "Zarząd" },
  { href: "/#polowania", label: "Polowania" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#aktualnosci", label: "Aktualności" },
  { href: "/#kontakt", label: "Kontakt" },
  { href: "/zglos-szkode", label: "Zgłoś szkodę" },
] as const;

export const board = [
  {
    name: "Andrzej Woźniak",
    role: "Prezes Koła",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Marek Kaczmarek",
    role: "Łowczy",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Elżbieta Nowak",
    role: "Skarbnik",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Piotr Zieliński",
    role: "Sekretarz",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tomasz Leśniak",
    role: "Gospodarz łowiska",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export const events = [
  {
    date: "2026-09-06",
    time: "05:30",
    title: "Polowanie zbiorowe na dziki",
    place: "Obwód nr 47 — uroczysko Jawor",
    type: "Polowanie zbiorowe",
    status: "Zapisy otwarte",
  },
  {
    date: "2026-09-20",
    time: "09:00",
    title: "Szkolenie strzeleckie i BHP",
    place: "Strzelnica myśliwska, Kielce",
    type: "Szkolenie",
    status: "Obowiązkowe",
  },
  {
    date: "2026-10-11",
    time: "06:00",
    title: "Polowanie zbiorowe na jelenie",
    place: "Obwód nr 47 — uroczysko Smug",
    type: "Polowanie zbiorowe",
    status: "Zapisy otwarte",
  },
  {
    date: "2026-11-03",
    time: "10:00",
    title: "Hubertus 2026",
    place: "Leśniczówka Bór",
    type: "Święto koła",
    status: "Dla członków i gości",
  },
  {
    date: "2026-12-12",
    time: "17:00",
    title: "Walne zgromadzenie członków",
    place: "Świetlica koła, Leśniczówka Bór",
    type: "Zebranie",
    status: "Tylko członkowie",
  },
] as const;

export const gallery = [
  {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    alt: "Poranne światło wśród koron drzew",
    caption: "Puszcza o świcie",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1484406566184-28d2ef07d749?auto=format&fit=crop&w=1200&q=80",
    alt: "Jeleń na skraju polany",
    caption: "Jeleń szlachetny",
    span: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1200&q=80",
    alt: "Mgła wśród sosen",
    caption: "Mgły nad borem",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
    alt: "Byk jelenia w lesie",
    caption: "Król ostępów",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    alt: "Leśna ścieżka w słońcu",
    caption: "Droga przez uroczysko",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    alt: "Gęsty las we mgle",
    caption: "Ostępy koła",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?auto=format&fit=crop&w=1200&q=80",
    alt: "Las iglasty",
    caption: "Bór sosnowy",
    span: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    alt: "Promienie słońca nad lasem",
    caption: "Światło nad obwodem",
    span: "wide",
  },
] as const;

export const news = [
  {
    slug: "rozpoczecie-sezonu-polowan-zbiorowych",
    date: "2026-08-12",
    category: "Sezon",
    title: "Rozpoczynamy sezon polowań zbiorowych",
    excerpt:
      "Zarząd ogłasza kalendarz polowań zbiorowych na sezon 2026/2027. Zapisy dla członków koła ruszyły w kancelarii.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
    content: [
      "Sezon polowań zbiorowych w Kole Łowieckim „Bór” rozpoczynamy zgodnie z planem zagospodarowania obwodu i wytycznymi Okręgu Kieleckiego PZŁ. Pierwsze zbiórki odbędą się na uroczysku Jawor.",
      "Przypominamy o obowiązku udziału w szkoleniu strzeleckim oraz aktualnym badaniach lekarskich. Listy obecności prowadzi łowczy koła. Osoby nieobecne na szkoleniu BHP nie zostaną dopuszczone do polowania zbiorowego.",
      "Kalendarz jest dostępny w sekcji Polowania na stronie internetowej oraz w kancelarii koła. Prosimy o zgłaszanie udziału najpóźniej na 48 godzin przed zbiórką.",
    ],
  },
  {
    slug: "sadzenie-lasu-z-nadlesnictwem",
    date: "2026-04-18",
    category: "Gospodarka",
    title: "Wspólne sadzenie lasu z Nadleśnictwem",
    excerpt:
      "Członkowie koła posadzili ponad dwa tysiące sadzonek sosny i dębu. To kolejny rok współpracy z lasami państwowymi.",
    image:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1400&q=80",
    content: [
      "W kwietniu członkowie Koła Łowieckiego „Bór” wzięli udział w akcji odnowienia drzewostanu na terenie obwodu nr 47. Sadzonki — sosna zwyczajna i dąb szypułkowy — pochodziły ze szkółki Nadleśnictwa.",
      "Gospodarka łowiecka nie kończy się na polowaniu. Dbamy o ostoję, poletka zgryzowe, wodopoje i ciszę w ostępach. Sadzenie lasu jest naturalną częścią naszej misji.",
      "Dziękujemy Nadleśnictwu za merytoryczne wsparcie i zapraszamy rodziny członków na kolejne działania terenowe jesienią.",
    ],
  },
  {
    slug: "monitoring-populacji-jelenia",
    date: "2026-02-03",
    category: "Przyroda",
    title: "Monitoring populacji jelenia szlachetnego",
    excerpt:
      "Zimowa inwentaryzacja potwierdza stabilny stan populacji. Plan odstrzału na nowy sezon został skorygowany.",
    image:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1400&q=80",
    content: [
      "Zimowy monitoring tropów i obserwacje przy paśnikach wskazują na stabilną, zdrową populację jelenia szlachetnego w obwodzie. Wyniki przekazaliśmy do zarządu okręgowego PZŁ.",
      "Plan łowiecki na sezon 2026/2027 uwzględnia ochronę byków selekcyjnych oraz wzmożoną presję na dzika, zgodnie z krajowym programem zwalczania ASF.",
      "Dziękujemy myśliwym dyżurującym przy zimowym dokarmianiu. Bez tej pracy gospodarka populacyjna nie byłaby możliwa.",
    ],
  },
] as const;

export function getNewsBySlug(slug: string) {
  return news.find((item) => item.slug === slug);
}

export const membershipSteps = [
  {
    title: "Rozmowa i rekomendacja",
    text: "Kandydat powinien znać przynajmniej jednego członka koła, który go przedstawi zarządowi.",
  },
  {
    title: "Szkolenie i uprawnienia",
    text: "Wymagane jest świadectwo myśliwego PZŁ oraz aktualne badania lekarskie i OC.",
  },
  {
    title: "Uchwała zarządu",
    text: "Po okresie kandydackim walne zgromadzenie podejmuje uchwałę o przyjęciu w poczet członków.",
  },
] as const;
