export const signupTypes = ["public", "members"] as const;
export type SignupType = (typeof signupTypes)[number];

export const signupTypeLabels: Record<SignupType, string> = {
  public: "Publiczne — każdy może się zapisać",
  members: "Tylko zalogowani członkowie koła",
};

export type ClubEvent = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string;
  description: string;
  capacity: number | null;
  signup_type: SignupType;
  created_by: string | null;
  created_at: string;
};

export type EventSignup = {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  created_at: string;
};
