import React from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const USFlag = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" className="rounded-sm">
      <rect width="20" height="15" fill="#B22234"/>
      <rect width="20" height="1.15" y="1.15" fill="white"/>
      <rect width="20" height="1.15" y="3.46" fill="white"/>
      <rect width="20" height="1.15" y="5.77" fill="white"/>
      <rect width="20" height="1.15" y="8.08" fill="white"/>
      <rect width="20" height="1.15" y="10.38" fill="white"/>
      <rect width="20" height="1.15" y="12.69" fill="white"/>
      <rect width="8" height="7.5" fill="#3C3B6E"/>
    </svg>
  );

  const SpainFlag = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" className="rounded-sm">
      <rect width="20" height="15" fill="#AA151B"/>
      <rect width="20" height="7.5" y="3.75" fill="#F1BF00"/>
    </svg>
  );

  const languageOptions = [
    { value: 'en', flag: <USFlag />, label: 'EN', alt: 'English' },
    { value: 'es', flag: <SpainFlag />, label: 'ES', alt: 'Español' }
  ];

  return (
    <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
      {languageOptions.map((lang) => (
        <button
          key={lang.value}
          onClick={() => setLanguage(lang.value)}
          className={`
            px-2 py-1 rounded transition-all duration-200 flex items-center gap-1
            ${
              language === lang.value
                ? 'bg-white/20 shadow-sm scale-110'
                : 'hover:bg-white/10 hover:scale-105'
            }
          `}
          title={lang.alt}
        >
          {lang.flag}
          <span className="text-xs font-medium text-white">{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;