export type Hunt = {
  id: string;
  title: string;
  hunt_date: string;
  meeting_time: string | null;
  location: string;
  notes: string;
  created_by: string | null;
  created_at: string;
};

export type Stand = {
  id: string;
  hunt_id: string;
  name: string;
  sort_order: number;
};

export type Reservation = {
  id: string;
  hunt_id: string;
  stand_id: string;
  user_id: string;
  created_at: string;
};
