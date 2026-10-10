import { api } from './auth';

export interface Astrologer {
  id: string;
  name: string;
  skills: string;
  languages: string;
  exp: string;
  orders: string;
  rating: string;
  isFree: boolean;
  price: string;
  avatar: string;
}

export interface ZodiacCategory {
  name: string;
  dates: string;
}

export interface AstroService {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface HoroscopeData {
  sign: string;
  prediction: string;
  lucky_colors: string[];
  lucky_numbers: string;
  scores: {
    love: number;
    career: number;
    health: number;
  };
}

export const FALLBACK_CATEGORIES: ZodiacCategory[] = [
  { name: 'Aries', dates: '21 Mar - 19 Apr' },
  { name: 'Taurus', dates: '20 Apr - 20 May' },
  { name: 'Gemini', dates: '21 May - 20 Jun' },
  { name: 'Cancer', dates: '21 Jun - 22 Jul' },
  { name: 'Leo', dates: '23 Jul - 22 Aug' },
  { name: 'Virgo', dates: '23 Aug - 22 Sep' },
  { name: 'Libra', dates: '23 Sep - 22 Oct' },
  { name: 'Scorpio', dates: '23 Oct - 21 Nov' },
  { name: 'Sagittarius', dates: '22 Nov - 21 Dec' },
  { name: 'Capricorn', dates: '22 Dec - 19 Jan' },
  { name: 'Aquarius', dates: '20 Jan - 18 Feb' },
  { name: 'Pisces', dates: '19 Feb - 20 Mar' },
];

export const FALLBACK_ASTROLOGERS: Astrologer[] = [
  {
    id: '1',
    name: 'Samikasha',
    skills: 'Vedic, Vastu',
    languages: 'English, Hindi, Punjabi, Gujarati',
    exp: 'Exp. 5 Years',
    orders: '3012 Orders',
    rating: '4.95',
    isFree: true,
    price: 'Free',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Vaibhav Sen',
    skills: 'Vedic, Numerology',
    languages: 'English, Hindi, Punjabi',
    exp: 'Exp. 6 Years',
    orders: '3012 Orders',
    rating: '4.88',
    isFree: false,
    price: '$5/min',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Nidhi Chopra',
    skills: 'Vedic, Tarot',
    languages: 'English, Hindi, Gujarati',
    exp: 'Exp. 3 Years',
    orders: '3012 Orders',
    rating: '4.92',
    isFree: true,
    price: 'Free',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Rajesh Chohan',
    skills: 'Vedic, Palmistry',
    languages: 'English, Hindi, Punjabi',
    exp: 'Exp. 8 Years',
    orders: '3012 Orders',
    rating: '4.90',
    isFree: false,
    price: '$6/min',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Basnt Pramod',
    skills: 'Vedic, Nadi',
    languages: 'English, Hindi',
    exp: 'Exp. 10 Years',
    orders: '3012 Orders',
    rating: '4.96',
    isFree: false,
    price: '$8/min',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Prakash Modi',
    skills: 'Vedic, Face Reading',
    languages: 'English, Hindi, Gujarati',
    exp: 'Exp. 16 Years',
    orders: '3012 Orders',
    rating: '4.98',
    isFree: true,
    price: 'Free',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const FALLBACK_SERVICES: AstroService[] = [
  { id: '1', title: 'Palm Reading', icon: '✋', color: '#FFF5F0' },
  { id: '2', title: 'Tarot Reading', icon: '🃏', color: '#F0F5FF' },
  { id: '3', title: 'Kundli & Vastu', icon: '☸️', color: '#FFF0F5' },
  { id: '4', title: 'Numerology', icon: '🔢', color: '#F0FFF5' },
];

export const astroApi = {
  getCategories: async (): Promise<ZodiacCategory[]> => {
    try {
      const response = await api.get('/chat/categories');
      return response.data?.results || FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  getAstrologers: async (): Promise<Astrologer[]> => {
    try {
      const response = await api.get('/chat/astrologers');
      return response.data?.results || FALLBACK_ASTROLOGERS;
    } catch {
      return FALLBACK_ASTROLOGERS;
    }
  },

  getServices: async (): Promise<AstroService[]> => {
    try {
      const response = await api.get('/chat/services');
      return response.data?.results || FALLBACK_SERVICES;
    } catch {
      return FALLBACK_SERVICES;
    }
  },

  getHoroscope: async (sign: string): Promise<HoroscopeData> => {
    try {
      const response = await api.get(`/chat/horoscope/${sign}`);
      return response.data;
    } catch {
      return {
        sign,
        prediction: `Today brings clarity and fresh cosmic motivation for ${sign}. Trust your natural instincts when navigating new opportunities in love and career.`,
        lucky_colors: ['#E53E3E', '#DD6B20'],
        lucky_numbers: '6, 9, 18',
        scores: { love: 70, career: 86, health: 60 },
      };
    }
  },
};
