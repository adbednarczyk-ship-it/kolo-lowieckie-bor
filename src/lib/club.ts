import { type SiteSettings } from "@/types/cms";

export function settingsToClub(settings: SiteSettings) {
  return {
    name: settings.club_name,
    founded: settings.stat_founded,
    members: settings.stat_members,
    email: settings.email,
    phone: settings.phone,
    hours: settings.hours,
    pzl: settings.pzl,
    address: {
      line1: settings.address_line1,
      line2: settings.address_line2,
      postal: settings.postal,
      city: settings.city,
    },
  };
}
