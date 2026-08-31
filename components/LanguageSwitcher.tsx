'use client';

import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ha', label: 'HA', name: 'Hausa' },
  { code: 'yo', label: 'YO', name: 'Yoruba' },
  { code: 'ig', label: 'IG', name: 'Igbo' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ruffneck_lang');
    if (saved && languages.some((l) => l.code === saved)) {
      setCurrentLang(saved);
      // Optional: trigger your actual translation system here
      document.documentElement.lang = saved;
    }
  }, []);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem('ruffneck_lang', code);
    document.documentElement.lang = code;
    setIsOpen(false);

    // If you use a translation library (next-intl, react-i18next, etc.)
    // call your changeLanguage function here.
    // Example: i18n.changeLanguage(code);
  };

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
        aria-label="Select language"
      >
        <span className="text-base">🌐</span>
        <span className="font-medium">{current.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  currentLang === lang.code
                    ? 'bg-cyan-600/20 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-medium">{lang.label}</span>
                <span className="ml-2 text-slate-500">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
