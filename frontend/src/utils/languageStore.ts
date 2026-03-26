import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'ru';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(persist(
  (set) => ({
    language: 'en',
    setLanguage: (language) => set({ language }),
  }),
  {
    name: 'helix-language',
  }
));
