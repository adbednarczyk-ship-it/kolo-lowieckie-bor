export type HuntingGround = {
  id: string;
  name: string;
  description: string;
  location: string;
  sort_order: number;
  created_at: string;
};

export type GroundReservation = {
  id: string;
  ground_id: string;
  user_id: string;
  reserved_on: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
};
