import React from 'react';
import { Select } from 'antd';
import { useLanguage } from '../src/contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <Select
      value={language}
      onChange={setLanguage}
      options={languageOptions.map(lang => ({
        value: lang.value,
        label: (
          <span className="flex items-center gap-2">
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </span>
        )
      }))}
      className="w-32"
      size="small"
    />
  );
};

export default LanguageSelector;