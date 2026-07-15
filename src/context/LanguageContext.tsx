import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { en } from '../constants/locales/en';

type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const language: Language = 'en';

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const translated = (en as Record<string, string>)[key];
      if (translated !== undefined) {
        return translated;
      }
      return fallback !== undefined ? fallback : key;
    },
    []
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: () => {},
      t,
    }),
    [t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return context;
};
