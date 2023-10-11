export type GetMessagesDTO = {
  limit: number;
  page: number;
  conversation: string;
  user1: string;
  user2: string;
};

export type GetConversationsDTO = {
  limit: number;
  page: number;
  user: string;
  keyword: string;
};

export type SendMessageDTO = {
  username: string;
  conversation: string;
  userTo: string;
  userFrom: string;
  text?: string;
  attachments?: { path: string; type: string }[];
};
