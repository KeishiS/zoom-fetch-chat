export type MeetingType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type UserType = "host" | "guest";
export type RecipientType = "everyone" | "host" | "guest" | "group";

export interface ParticipantJoinedInfo {
  user_id: string;
  user_name: string;
  id: string | null;
  participant_uuid: string | null;
  join_time: string;
  email: string;
  registrant_id: string | null;
  participant_user_id: string | null;
  customer_key: string | null;
  phone_number: string | null;
}

export interface ParticipantLeftInfo {
  user_id: string;
  user_name: string | null;
  id: string | null;
  participant_uuid: string | null;
  leave_time: string;
  leave_reason: string | null;
  email: string;
  registrant_id: string | null;
  participant_user_id: string | null;
  customer_key: string | null;
  phone_number: string | null;
}

export interface ParticipantJoinedPayload {
  account_id: string;
  object: {
    id: string | null;
    uuid: string;
    host_id: string;
    topic: string | null;
    type: MeetingType;
    start_time: string;
    timezone: string;
    duration: number;
    participant: ParticipantJoinedInfo;
  };
}

export interface ParticipantLeftPayload {
  account_id: string;
  object: {
    id: string | null;
    uuid: string;
    host_id: string;
    topic: string | null;
    type: MeetingType;
    start_time: string;
    timezone: string;
    duration: number;
    participant: ParticipantLeftInfo;
  };
}

export interface ChatMessage {
  date_time: string;
  sender_session_id: string;
  sender_name: string;
  sender_email: string | null;
  sender_type: UserType;
  recipient_session_id: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_type: RecipientType;
  message_id: string;
  message_content: string;
  file_ids: string[] | null;
}

export interface MessageSentPayload {
  account_id: string;
  object: {
    id: number;
    uuid: string;
    chat_message: ChatMessage;
  };
}

export interface UrlValidationPayload {
  plainToken: string;
}

export type ZoomPayload =
  | ParticipantJoinedPayload
  | ParticipantLeftInfo
  | MessageSentPayload
  | UrlValidationPayload
  | any;

export interface ZoomBody {
  event: string;
  event_ts: number;
  payload: ZoomPayload;
}
