import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nInitPromise } from '@/src/configs/translations';

interface I18nContextType {
  isLanguageInitialized: boolean;
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<I18nContextType>({
  isLanguageInitialized: false,
  currentLanguage: 'fa',
  changeLanguage: async () => {},
  t: () => '',
});

export const useI18nContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fa');

  // Use react-i18next hook
  const { t: i18nT, i18n } = useTranslation();

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await i18nInitPromise;
        setCurrentLanguage(i18n.language || 'fa');
        setIsLanguageInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setIsLanguageInitialized(true);
      }
    };

    initializeI18n();
  }, [i18n.language]);

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);

      // Update service i18n
      updateServiceI18nLocale(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key: string, options?: any): string => {
    return i18nT(key, options) as string;
  };

  return (
    <LanguageContext.Provider
      value={{
        isLanguageInitialized,
        currentLanguage,
        changeLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

let updateServiceI18nLocale: (locale: string) => void = () => {};

export const setServiceI18nUpdater = (updater: (locale: string) => void) => {
  updateServiceI18nLocale = updater;
};
