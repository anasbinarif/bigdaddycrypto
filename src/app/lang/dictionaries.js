const dictionaries = {
    en: () => import('../../dictionaries/en.json').then((module) => module.default),
    de: () => import('../../../messages/de.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
    const loadDictionary = dictionaries[locale] || dictionaries['de']; // Fallback to 'en'
    return loadDictionary();
};