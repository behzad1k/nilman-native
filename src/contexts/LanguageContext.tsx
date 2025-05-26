import React, { createContext, useContext, useEffect, useState } from 'react';
import { i18nInitPromise } from '@/src/configs/translations';

interface I18nContextType {
  isLanguageInitialized: boolean;
}

const LanguageContext = createContext<I18nContextType>({
  isLanguageInitialized: false,
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

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await i18nInitPromise;
        setIsLanguageInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Still set to true to prevent infinite loading
        setIsLanguageInitialized(true);
      }
    };

    initializeI18n();
  }, []);

  return (
    <LanguageContext.Provider value={{ isLanguageInitialized: isLanguageInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};
