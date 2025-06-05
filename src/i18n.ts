import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { registerLocale } from 'react-datepicker';
import {
  enUS, es,
} from 'date-fns/locale';

// Locales
import * as locales from './locales';

registerLocale('en', enUS);
registerLocale('es', es);

// Translations
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: locales,
    ns: 'main',
    missingKeyHandler: false,

    supportedLngs: ['en', 'es', 'ar', 'ur'],
    fallbackLng: 'en',
    fallbackNS: 'main',

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'clinre-language',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
