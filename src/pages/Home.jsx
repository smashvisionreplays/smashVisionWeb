import BlurredContainer from "../../components/home/BlurredContainer";
import { useLanguage } from '../contexts/LanguageContext';

export default function Home({ triggerNotification }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ marginTop: window.innerWidth < 1000 ? '5rem' : '0' }}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8 overflow-visible flex justify-center sm:justify-start">
            <div className="flex flex-wrap items-baseline " style={{ lineHeight: '1.3' }}>
              <span className="text-white/90 drop-shadow-2xl mr-2">{t('findYourGame').split(' ')[0]}</span>
              <span className="text-white/70 mr-2">{t('findYourGame').split(' ')[1]}</span>
              <span className="bg-gradient-to-r from-[#DDF31A] via-[#B8E016] to-[#9BC53D] bg-clip-text text-transparent font-extrabold drop-shadow-lg text-4xl sm:text-5xl lg:text-7xl pb-3 block">{t('findYourGame').split(' ')[2]}</span>
            </div>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-8 leading-relaxed">
            {t('gameDescription')}
          </p>
          <div className="flex flex-row  gap-4 justify-around lg:justify-start">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-[#DDF31A] rounded-full"></div>
              <span className="text-sm sm:text-base">{t('feature1')}</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 bg-[#6c8f22] rounded-full"></div>
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