import 'server-only';

// To keep things simple, we'll stick to one language for now.
// The app will default to Spanish.
const dictionary = () => import('@/locales/es.json').then((module) => module.default);

export const getDictionary = async (locale: string) => {
  return dictionary();
};
