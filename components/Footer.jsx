import { Link } from 'react-router-dom';
import { useLanguage } from '../src/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Contact Us section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">{t('contactUs')}</p>
          <div className="flex items-center gap-3">
            <a
              href="mailto:admin@smashvisionapp.com"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm px-4 py-2 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
              </svg>
              Email
            </a>
            <a
              href="https://wa.me/573138152250"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/35 text-[#25D366] text-sm px-4 py-2 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/">
            <img
              src="./logo.webp"
              alt="SmashVision"
              className="h-8 w-auto opacity-60 hover:opacity-90 transition-opacity"
            />
          </Link>

          <p className="text-white/40 text-xs">© 2025 SmashVision. All rights reserved.</p>

          <div className="flex gap-5">
            <Link to="/terms/privacy-policy" className="text-white/50 hover:text-white/80 text-xs transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link to="/terms/terms-and-conditions" className="text-white/50 hover:text-white/80 text-xs transition-colors">
              {t('termsOfUse')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}