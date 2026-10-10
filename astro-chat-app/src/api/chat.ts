import { api } from './auth';

export interface ChatMessageItem {
  id: number;
  sender_type: 'user' | 'astro';
  message: string;
  timestamp: string;
}

export interface SendMessageResponse {
  user_message: ChatMessageItem;
  astro_message: ChatMessageItem;
}

export interface ChatHistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessageItem[];
}

export const chatApi = {
  sendMessage: async (message: string): Promise<SendMessageResponse> => {
    const response = await api.post('/chat/send', { message });
    return response.data;
  },

  getHistory: async (page = 1): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history?page=${page}`);
    return response.data;
  },
};
