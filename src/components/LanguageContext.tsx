import { createContext, createSignal, useContext } from 'solid-js';

type Language = 'id' | 'en';

const LanguageContext = createContext<{
  language: () => Language;
  setLanguage: (lang: Language) => void;
}>();

export const LanguageProvider = (props: { children: any }) => {
  const [language, setLanguage] = createSignal<Language>('id');
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
