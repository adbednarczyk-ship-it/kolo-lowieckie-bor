export const damageStatuses = [
  "nowe",
  "szacowanie",
  "oszacowane",
  "zamkniete",
] as const;

export type DamageStatus = (typeof damageStatuses)[number];

export const damageStatusLabels: Record<DamageStatus, string> = {
  nowe: "Nowe",
  szacowanie: "W trakcie szacowania",
  oszacowane: "Oszacowane",
  zamkniete: "Zamknięte",
};

export type DamageReport = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  plot_location: string;
  description: string;
  noticed_on: string;
  status: DamageStatus;
  assignee_id: string | null;
  internal_notes: string;
  created_at: string;
};

export type DamagePhoto = {
  id: string;
  report_id: string;
  image_url: string;
};
