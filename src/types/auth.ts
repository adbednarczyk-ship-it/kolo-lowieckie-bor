export const userRoles = ["admin", "board", "member"] as const;

export type UserRole = (typeof userRoles)[number];

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  board: "Zarząd",
  member: "Członek koła",
};
