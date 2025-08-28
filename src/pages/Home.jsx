import BlurredContainer from "../../components/home/BlurredContainer";
import { useLanguage } from '../contexts/LanguageContext';

export default function Home({ triggerNotification }) {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-start justify-center px-4 ">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white/90 mb-6">
            {t('findYourGame')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-8 leading-relaxed">
            {t('gameDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm sm:text-base">{t('feature1')}</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm sm:text-base">{t('feature2')}</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full">
          <BlurredContainer triggerNotification={triggerNotification} />
        </div>
      </div>
    </div>
  );
}