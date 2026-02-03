import { Link } from 'react-router-dom';
import { useLanguage } from '../src/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            © 2025 SmashVision
          </div>
          <div className="flex gap-6">
            <Link 
              to="/terms/privacy-policy" 
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              {t('privacyPolicy')}
            </Link>
            <Link 
              to="/terms/terms-and-conditions" 
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              {t('termsOfUse')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}