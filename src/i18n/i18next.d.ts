import 'i18next';
import esTranslations from './locales/es.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof esTranslations;
    };
  }
}