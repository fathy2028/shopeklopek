import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}
        onClick={() => changeLanguage('ar')}
        title="العربية"
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
