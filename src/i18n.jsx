import { createContext, useContext, useEffect, useState } from 'react';
import { I18N } from './data/i18n.js';

const LangContext = createContext({ lang: 'zh', t: (k) => k, toggle: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('cs_lang') || 'zh';
    } catch {
      return 'zh';
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }, [lang]);

  const value = {
    lang,
    t: (key) => I18N[lang][key] ?? I18N.zh[key] ?? key,
    toggle: () => {
      setLang((prev) => {
        const next = prev === 'zh' ? 'en' : 'zh';
        try {
          localStorage.setItem('cs_lang', next);
        } catch {
          /* ignore */
        }
        return next;
      });
    },
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}
