export type ClubMessage = {
  id: string;
  sender_id: string;
  subject: string;
  body: string;
  created_at: string;
};

export type MessageRecipient = {
  message_id: string;
  user_id: string;
  read_at: string | null;
};
