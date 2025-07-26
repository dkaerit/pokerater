import 'server-only';

const dictionaries: { [key: string]: () => Promise<any> } = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const dictionaryLoader = dictionaries[locale] ?? dictionaries.en;
  return dictionaryLoader();
};
