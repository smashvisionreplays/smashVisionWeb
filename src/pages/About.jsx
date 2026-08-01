import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { PlayersAbout } from './ForPlayers';

// External destinations kept as named constants (no inline URLs)
const CONTACT_EMAIL = 'admin@smashvisionapp.com';
const WHATSAPP_URL = 'https://wa.me/573138152250';

/* ---------------------------------- Icons --------------------------------- */
const iconBase = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Icons = {
  heart: (p) => (
    <svg {...iconBase} {...p}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
  ),
  film: (p) => (
    <svg {...iconBase} {...p}><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M7 4.5v15M17 4.5v15M3 9.5h4M17 9.5h4M3 14.5h4M17 14.5h4" /></svg>
  ),
  whistle: (p) => (
    <svg {...iconBase} {...p}><path d="M11 8h9a1 1 0 0 1 1 1v2a5 5 0 1 1-9-3z" /><circle cx="8" cy="15" r="1" /><path d="M12 4v3M9.5 4.6l1 2.7M14.5 4.6l-1 2.7" /></svg>
  ),
  broadcast: (p) => (
    <svg {...iconBase} {...p}><circle cx="12" cy="12" r="2.5" /><path d="M6.5 6.5a7.5 7.5 0 0 0 0 11M17.5 6.5a7.5 7.5 0 0 1 0 11M3.8 3.8a11.5 11.5 0 0 0 0 16.4M20.2 3.8a11.5 11.5 0 0 1 0 16.4" /></svg>
  ),
  shield: (p) => (
    <svg {...iconBase} {...p}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" /><path d="M9.5 12l1.8 1.8 3.2-3.6" /></svg>
  ),
  chart: (p) => (
    <svg {...iconBase} {...p}><path d="M4 20V4M4 20h16M8 20v-6M12 20v-9M16 20v-4" /></svg>
  ),
  camera: (p) => (
    <svg {...iconBase} {...p}><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.8l1-1.6a1 1 0 0 1 .85-.4h5.7a1 1 0 0 1 .85.4l1 1.6h1.8A1.5 1.5 0 0 1 20 8.5v8A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  bolt: (p) => (
    <svg {...iconBase} {...p}><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" /></svg>
  ),
  moon: (p) => (
    <svg {...iconBase} {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" /></svg>
  ),
  arrow: (p) => (
    <svg {...iconBase} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
};

/* --------------------------------- Content -------------------------------- */
const content = {
  en: {
    kicker: 'For Clubs',
    heroTitle: 'Every game your members play',
    heroTitleAccent: 'becomes an asset your club owns.',
    heroText:
      'We install professional cameras in your courts that record every match automatically. Members relive their games, clip their best points, and share them — while your club builds a branded content library and gains 24/7 court visibility. Zero effort from your staff.',
    heroCtaPrimary: 'Book a demo',
    heroCtaSecondary: 'See what players get',

    problemKicker: 'The problem',
    problemTitle: 'Everything that happens on your courts disappears the moment the game ends.',
    problems: [
      {
        title: 'Great moments, gone forever',
        text: 'Members play their best points and never see them again — nothing to relive, share, or bring them back.',
      },
      {
        title: 'Constant pressure for content',
        text: 'Social media never stops asking for fresh, authentic footage. Making it manually is slow and expensive.',
      },
      {
        title: 'Coaching without playback',
        text: 'Classes rely on memory. Coaches describe mistakes instead of showing them, and players have nothing to review.',
      },
      {
        title: 'No eyes on your courts',
        text: 'Once staff leave, you have no record of what happened — during the day, overnight, or between bookings.',
      },
    ],

    solutionKicker: 'The solution',
    solutionTitle: 'One camera system. A platform your members love and an asset your club owns.',
    solutionText:
      'We install the hardware, connect it to SmashVision, and run it for you. From then on, every match on every court records, uploads, and is ready — automatically.',

    featuresKicker: 'What SmashVision does for your club',
    features: [
      {
        icon: 'heart',
        title: 'Engage & retain members',
        text: 'Players watch their full match and leave with highlights they are proud to share — a differentiator they will not find elsewhere. It turns a booking into an experience, and an experience into loyalty.',
      },
      {
        icon: 'film',
        title: 'An automatic content engine',
        text: 'Every member clip is watermarked with your brand and added to your content pool. 100 active members generate dozens of authentic clips a week — ready to post to Instagram, TikTok, or YouTube.',
      },
      {
        icon: 'whistle',
        title: 'Supercharge classes & coaching',
        text: 'During class, press the court-side button to bookmark any moment. It appears highlighted on the recording, so coaches and players jump straight to what mattered and clip it to study. Video analysis, as standard.',
      },
      {
        icon: 'broadcast',
        title: 'Live streaming for the public',
        text: 'Go live from any court with one button — no external accounts, no setup. It streams on the SmashVision platform and appears instantly on the public Lives page. Broadcast tournaments, finals, and league nights.',
      },
      {
        icon: 'shield',
        title: '24/7 security & visibility',
        text: 'Cameras record across all your operating hours — and overnight on request. Keep eyes on the club after closing, review incidents, and protect your facilities around the clock.',
      },
      {
        icon: 'chart',
        title: 'Statistics & insights',
        text: 'Your dashboard shows clips generated, best points captured, and video minutes delivered over any date range — exactly how much value members get and content your club banks.',
      },
    ],

    howKicker: 'How it works',
    howSteps: [
      { icon: 'camera', title: 'We install the cameras', text: 'Professional cameras go up on your courts and connect through a secure tunnel — no IT headaches.' },
      { icon: 'bolt', title: 'Every game records itself', text: 'Matches record automatically during your hours and upload to secure cloud streaming. Staff does nothing.' },
      { icon: 'film', title: 'Members watch, clip & share', text: 'Players find their game by club, court, date, and time, watch it back, and download branded clips.' },
      { icon: 'chart', title: 'Your club reaps the value', text: 'Content library, engaged members, coaching playback, live streaming, and 24/7 visibility — in one dashboard.' },
    ],

    adsKicker: 'Beyond content',
    adsTitle: 'Your recordings and clips are ad space you can sell.',
    adsText:
      'Every game recording and member clip includes dedicated advertising spaces — real estate you can sell to sponsors and local partners. Their brand rides along on authentic padel content generated by real players on your courts, every week. It is a new revenue stream built into footage you are already capturing.',

    finalTitle: 'You already have the courts. You already have the players.',
    finalText: 'SmashVision turns what is already happening into a platform your members love and an asset your club owns. Let us show you how it works.',
    finalCtaPrimary: 'Talk to us on WhatsApp',
    finalCtaSecondary: 'Email us',
  },

  es: {
    kicker: 'Para Clubes',
    heroTitle: 'Cada partido que juegan tus miembros',
    heroTitleAccent: 'se convierte en un activo de tu club.',
    heroText:
      'Instalamos cámaras profesionales en tus canchas que graban cada partido automáticamente. Tus miembros reviven sus juegos, recortan sus mejores puntos y los comparten — mientras tu club construye una biblioteca de contenido con tu marca y obtiene visibilidad 24/7 de las canchas. Sin ningún esfuerzo de tu personal.',
    heroCtaPrimary: 'Agenda una demo',
    heroCtaSecondary: 'Ver qué obtienen los jugadores',

    problemKicker: 'El problema',
    problemTitle: 'Todo lo que pasa en tus canchas desaparece en el momento en que termina el juego.',
    problems: [
      {
        title: 'Grandes momentos, perdidos para siempre',
        text: 'Tus miembros juegan sus mejores puntos y nunca los vuelven a ver — nada que revivir, compartir o que los haga volver.',
      },
      {
        title: 'Presión constante por contenido',
        text: 'Las redes nunca dejan de pedir material fresco y auténtico. Producirlo manualmente es lento y caro.',
      },
      {
        title: 'Clases sin repetición',
        text: 'Las clases dependen de la memoria. Los entrenadores describen los errores en lugar de mostrarlos, y los jugadores no tienen nada que repasar.',
      },
      {
        title: 'Sin ojos en tus canchas',
        text: 'Cuando el personal se va, no tienes registro de lo que pasó — durante el día, de noche o entre reservas.',
      },
    ],

    solutionKicker: 'La solución',
    solutionTitle: 'Un sistema de cámaras. Una plataforma que tus miembros aman y un activo que tu club posee.',
    solutionText:
      'Instalamos el hardware, lo conectamos a SmashVision y lo operamos por ti. Desde ese momento, cada partido en cada cancha se graba, se sube y queda listo — automáticamente.',

    featuresKicker: 'Lo que SmashVision hace por tu club',
    features: [
      {
        icon: 'heart',
        title: 'Engancha y fideliza',
        text: 'Los jugadores ven su partido completo y se van con highlights que comparten con orgullo — un diferenciador que no hallarán en otro lugar. Convierte una reserva en experiencia, y una experiencia en lealtad.',
      },
      {
        icon: 'film',
        title: 'Motor de contenido automático',
        text: 'Cada clip lleva la marca de agua de tu club y se suma a tu pool de contenido. 100 miembros activos generan decenas de clips auténticos por semana — listos para Instagram, TikTok o YouTube.',
      },
      {
        icon: 'whistle',
        title: 'Potencia clases y entrenamientos',
        text: 'Durante la clase, presiona el botón en la cancha para marcar cualquier momento. Aparece resaltado en la grabación, así entrenadores y jugadores saltan a lo que importó y lo recortan para estudiar. Análisis en video, de serie.',
      },
      {
        icon: 'broadcast',
        title: 'Transmisión en vivo pública',
        text: 'Transmite desde cualquier cancha con un botón — sin cuentas externas ni configuración. Se transmite en la plataforma SmashVision y aparece al instante en la página de En Vivo. Torneos, finales y noches de liga.',
      },
      {
        icon: 'shield',
        title: 'Seguridad y visibilidad 24/7',
        text: 'Las cámaras graban durante todo tu horario — y de noche si lo solicitas. Vigila el club tras el cierre, revisa incidentes y protege tus instalaciones las 24 horas.',
      },
      {
        icon: 'chart',
        title: 'Estadísticas e insights',
        text: 'Tu panel muestra clips generados, mejores puntos capturados y minutos de video entregados en cualquier rango de fechas — cuánto valor obtienen tus miembros y cuánto contenido acumula tu club.',
      },
    ],

    howKicker: 'Cómo funciona',
    howSteps: [
      { icon: 'camera', title: 'Instalamos las cámaras', text: 'Cámaras profesionales se instalan en tus canchas y se conectan mediante un túnel seguro — sin dolores de cabeza de IT.' },
      { icon: 'bolt', title: 'Cada juego se graba solo', text: 'Los partidos se graban automáticamente durante tu horario y se suben a la nube. Tu personal no hace nada.' },
      { icon: 'film', title: 'Los miembros ven y recortan', text: 'Los jugadores encuentran su juego por club, cancha, fecha y hora, lo ven y descargan clips con tu marca.' },
      { icon: 'chart', title: 'Tu club cosecha el valor', text: 'Biblioteca de contenido, miembros comprometidos, repetición para clases, vivo y visibilidad 24/7 — en un panel.' },
    ],

    adsKicker: 'Más allá del contenido',
    adsTitle: 'Tus grabaciones y clips son espacio publicitario que puedes vender.',
    adsText:
      'Cada grabación de partido y clip de tus miembros incluye espacios publicitarios dedicados — un espacio que puedes vender a patrocinadores y socios locales. Su marca acompaña contenido de pádel auténtico generado por jugadores reales en tus canchas, cada semana. Un nuevo ingreso integrado en material que ya estás capturando.',

    finalTitle: 'Ya tienes las canchas. Ya tienes los jugadores.',
    finalText: 'SmashVision convierte lo que ya está sucediendo en una plataforma que tus miembros aman y un activo que tu club posee. Déjanos mostrarte cómo funciona.',
    finalCtaPrimary: 'Escríbenos por WhatsApp',
    finalCtaSecondary: 'Envíanos un correo',
  },
};

/* ------------------------------- Components -------------------------------- */
function SectionKicker({ children }) {
  return (
    <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#DDF31A]/90 mb-4">
      {children}
    </span>
  );
}

// Rendered as the "For Clubs" tab inside the About shell (below).
function ClubsAbout({ language, onSwitchToPlayers }) {
  const c = content[language] || content.en;

  return (
    <>
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto">
          <SectionKicker>{c.kicker}</SectionKicker>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-white/90">{c.heroTitle} </span>
            <span className="bg-gradient-to-r from-[#DDF31A] via-[#B8E016] to-[#9BC53D] bg-clip-text text-transparent">
              {c.heroTitleAccent}
            </span>
          </h1>
          <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            {c.heroText}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {c.heroCtaPrimary}
              <Icons.arrow width="18" height="18" />
            </a>
            <button
              type="button"
              onClick={onSwitchToPlayers}
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 font-medium px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              {c.heroCtaSecondary}
            </button>
          </div>
        </section>

        {/* Problem */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto">
            <SectionKicker>{c.problemKicker}</SectionKicker>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 leading-snug">
              {c.problemTitle}
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {c.problems.map((p) => (
              <div
                key={p.title}
                className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7"
              >
                <h3 className="text-lg font-semibold text-white/90 mb-2">{p.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="mt-24 lg:mt-32">
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#DDF31A]/[0.07] to-white/[0.03] border border-[#DDF31A]/20 rounded-3xl p-8 sm:p-12 text-center">
            <SectionKicker>{c.solutionKicker}</SectionKicker>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 leading-snug max-w-3xl mx-auto">
              {c.solutionTitle}
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto">
              {c.solutionText}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionKicker>{c.featuresKicker}</SectionKicker>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.map((f) => {
              const Icon = Icons[f.icon];
              return (
                <div
                  key={f.title}
                  className="group backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#DDF31A]/25"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#DDF31A]/10 border border-[#DDF31A]/20 flex items-center justify-center text-[#DDF31A] mb-5 transition-transform duration-300 group-hover:scale-105">
                    <Icon width="24" height="24" />
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2.5">{f.title}</h3>
                  <p className="text-white/55 leading-relaxed text-[15px]">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionKicker>{c.howKicker}</SectionKicker>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.howSteps.map((s, i) => {
              const Icon = Icons[s.icon];
              return (
                <div key={s.title} className="relative backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                  <span className="absolute top-5 right-6 text-4xl font-bold text-white/[0.07]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="text-[#DDF31A] mb-5">
                    <Icon width="26" height="26" />
                  </div>
                  <h3 className="text-base font-semibold text-white/90 mb-2">{s.title}</h3>
                  <p className="text-white/55 leading-relaxed text-sm">{s.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Advertising angle */}
        <section className="mt-24 lg:mt-32">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="w-20 h-20 rounded-2xl bg-[#DDF31A]/10 border border-[#DDF31A]/20 flex items-center justify-center text-[#DDF31A] shrink-0 mx-auto lg:mx-0">
              <Icons.bolt width="40" height="40" />
            </div>
            <div>
              <SectionKicker>{c.adsKicker}</SectionKicker>
              <h2 className="text-2xl sm:text-3xl font-bold text-white/90 leading-snug mb-4">{c.adsTitle}</h2>
              <p className="text-white/60 leading-relaxed text-base sm:text-lg">{c.adsText}</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 leading-snug">
              {c.finalTitle}
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed text-base sm:text-lg">{c.finalText}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {c.finalCtaPrimary}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 font-medium px-8 py-3.5 rounded-xl transition-all duration-300"
              >
                {c.finalCtaSecondary}
              </a>
            </div>
          </div>
        </section>
    </>
  );
}

/* --------------------------- About shell (tabs) --------------------------- */
const TABS = [
  { key: 'clubs', labelKey: 'forClubs' },
  { key: 'players', labelKey: 'forPlayers' },
];

export default function About() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'players' ? 'players' : 'clubs';

  const selectTab = (key) => {
    setSearchParams(key === 'players' ? { tab: 'players' } : {});
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ marginTop: '4rem' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* Glass tab switcher */}
        <div className="flex justify-center">
          <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-lg">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => selectTab(tab.key)}
                  aria-pressed={isActive}
                  className={
                    'px-6 sm:px-10 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ' +
                    (isActive
                      ? 'bg-gradient-to-r from-[#DDF31A]/25 to-[#B8E016]/15 border border-[#DDF31A]/40 text-white shadow-[0_0_20px_-6px_rgba(221,243,26,0.5)]'
                      : 'border border-transparent text-white/50 hover:text-white/85 hover:bg-white/[0.06]')
                  }
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-12 lg:mt-16">
          {activeTab === 'clubs' ? (
            <ClubsAbout language={language} onSwitchToPlayers={() => selectTab('players')} />
          ) : (
            <PlayersAbout language={language} onSwitchToClubs={() => selectTab('clubs')} />
          )}
        </div>

      </div>
    </div>
  );
}
