import 'server-only';
import es from '@/locales/es.json';

// Simple dictionary implementation that returns the Spanish dictionary.
// It matches the function signature of a more complex i18n implementation.
export const getDictionary = async (locale: string) => {
  return es;
};
