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
      'SmashVision installs professional cameras in your courts that automatically record every match. Your members relive their games, create highlight clips, and share them — while your club builds a library of branded content, gains 24/7 court visibility, and offers an experience no other club has. Zero effort from your staff.',
    heroCtaPrimary: 'Book a demo',
    heroCtaSecondary: 'See what players get',

    problemKicker: 'The problem',
    problemTitle: 'Everything that happens on your courts disappears the moment the game ends.',
    problems: [
      {
        title: 'Great moments, gone forever',
        text: 'Your members play their best points and never see them again. There is nothing to relive, analyze, or share — and nothing that brings them back.',
      },
      {
        title: 'Constant pressure to make content',
        text: 'Social media never stops asking for fresh, authentic footage. Producing it manually is expensive, slow, and rarely feels real.',
      },
      {
        title: 'Coaching without playback',
        text: 'Private classes and clinics rely on memory. Coaches describe mistakes instead of showing them, and players have nothing to review at home.',
      },
      {
        title: 'No eyes on your courts',
        text: 'Once staff leave, you have no record of what happened on your premises — during the day, overnight, or between bookings.',
      },
    ],

    solutionKicker: 'The solution',
    solutionTitle: 'One camera system. A platform your members love and an asset your club owns.',
    solutionText:
      'We install the hardware, connect it to the SmashVision platform, and run it for you. From that moment, every match on every court is recorded, uploaded, and ready — automatically. What you do with it is where the value multiplies.',

    featuresKicker: 'What SmashVision does for your club',
    features: [
      {
        icon: 'heart',
        title: 'Engage & retain your members',
        text: 'Give players a reason to keep coming back. They watch their full match, relive every point, and leave with highlights they are proud to share — a differentiator members will not find anywhere else. It turns a booking into an experience, and an experience into loyalty.',
      },
      {
        icon: 'film',
        title: 'An automatic content engine',
        text: 'Every clip a member creates is watermarked with your brand and added to your club’s content pool. A club with 100 active members generates dozens of real, authentic gameplay clips every week — ready to download and post to Instagram, TikTok, or YouTube with zero work from your team.',
      },
      {
        icon: 'whistle',
        title: 'Supercharge private classes & coaching',
        text: 'Turn every lesson into a review session. During class, anyone can press the court-side button to bookmark a moment worth reviewing — a great point, a repeated mistake, a drill. Those moments show up highlighted on the recording, so coaches and players jump straight to what mattered and clip it to study later. Your academy offers video analysis as a standard feature — not a premium add-on.',
      },
      {
        icon: 'broadcast',
        title: 'Live streaming for the public',
        text: 'Go live from any court with a single button — no external accounts, no setup. Streaming runs automatically on the SmashVision platform and appears instantly on the public Lives page. Broadcast tournaments, finals, and league nights, and give distant fans a front-row seat.',
      },
      {
        icon: 'shield',
        title: '24/7 security & court visibility',
        text: 'Our cameras record across all your operating hours — and overnight on request — so you always know what happens on your courts. Use private monitoring to keep eyes on the club after closing, review incidents, and protect your facilities around the clock.',
      },
      {
        icon: 'chart',
        title: 'Statistics & insights',
        text: 'A club dashboard shows clips generated, best points captured, and video minutes delivered over any date range. See exactly how much value your members are getting from the platform — and how much content your club is banking.',
      },
    ],

    howKicker: 'How it works',
    howSteps: [
      { icon: 'camera', title: 'We install the cameras', text: 'Professional cameras go up on your courts and connect to the internet through a secure tunnel — no port forwarding, no IT headaches.' },
      { icon: 'bolt', title: 'Every game records itself', text: 'Matches are recorded automatically during your operating hours and uploaded to secure cloud streaming. Your staff does nothing.' },
      { icon: 'film', title: 'Members watch, clip & share', text: 'Players find their game by club, court, date, and time, watch it back, and create branded highlight clips they download and share.' },
      { icon: 'chart', title: 'Your club reaps the value', text: 'You get a content library, engaged members, coaching playback, live streaming, and round-the-clock court visibility — all in one dashboard.' },
    ],

    adsKicker: 'Beyond content',
    adsTitle: 'Structured, branded video is advertising inventory.',
    adsText:
      'Every clip your members generate is watermarked and downloadable — structured video content you can offer to sponsors and partners. It is a format far more engaging than static banners, and it is generated by real players on your courts, every single week. SmashVision turns what is already happening at your club into a marketing asset you own.',

    finalTitle: 'You already have the courts. You already have the players.',
    finalText: 'SmashVision turns what is already happening into a platform your members love and a marketing asset your club owns. Let us show you how it works at your club.',
    finalCtaPrimary: 'Talk to us on WhatsApp',
    finalCtaSecondary: 'Email us',
  },

  es: {
    kicker: 'Para Clubes',
    heroTitle: 'Cada partido que juegan tus miembros',
    heroTitleAccent: 'se convierte en un activo de tu club.',
    heroText:
      'SmashVision instala cámaras profesionales en tus canchas que graban automáticamente cada partido. Tus miembros reviven sus juegos, crean clips de sus mejores momentos y los comparten — mientras tu club construye una biblioteca de contenido con tu marca, obtiene visibilidad 24/7 de las canchas y ofrece una experiencia que ningún otro club tiene. Sin ningún esfuerzo de tu personal.',
    heroCtaPrimary: 'Agenda una demo',
    heroCtaSecondary: 'Ver qué obtienen los jugadores',

    problemKicker: 'El problema',
    problemTitle: 'Todo lo que pasa en tus canchas desaparece en el momento en que termina el juego.',
    problems: [
      {
        title: 'Grandes momentos, perdidos para siempre',
        text: 'Tus miembros juegan sus mejores puntos y nunca los vuelven a ver. No hay nada que revivir, analizar o compartir — y nada que los haga volver.',
      },
      {
        title: 'Presión constante por crear contenido',
        text: 'Las redes sociales nunca dejan de pedir material fresco y auténtico. Producirlo manualmente es caro, lento y rara vez se siente real.',
      },
      {
        title: 'Clases sin repetición',
        text: 'Las clases privadas y los clinics dependen de la memoria. Los entrenadores describen los errores en lugar de mostrarlos, y los jugadores no tienen nada que repasar en casa.',
      },
      {
        title: 'Sin ojos en tus canchas',
        text: 'Cuando el personal se va, no tienes registro de lo que pasó en tus instalaciones — durante el día, de noche o entre reservas.',
      },
    ],

    solutionKicker: 'La solución',
    solutionTitle: 'Un sistema de cámaras. Una plataforma que tus miembros aman y un activo que tu club posee.',
    solutionText:
      'Instalamos el hardware, lo conectamos a la plataforma SmashVision y lo operamos por ti. Desde ese momento, cada partido en cada cancha se graba, se sube y queda listo — automáticamente. Lo que haces con ello es donde el valor se multiplica.',

    featuresKicker: 'Lo que SmashVision hace por tu club',
    features: [
      {
        icon: 'heart',
        title: 'Engancha y fideliza a tus miembros',
        text: 'Dale a los jugadores una razón para volver. Ven su partido completo, reviven cada punto y se van con highlights que están orgullosos de compartir — un diferenciador que no encontrarán en ningún otro lugar. Convierte una reserva en una experiencia, y una experiencia en lealtad.',
      },
      {
        icon: 'film',
        title: 'Un motor de contenido automático',
        text: 'Cada clip que crea un miembro lleva la marca de agua de tu marca y se añade al pool de contenido de tu club. Un club con 100 miembros activos genera decenas de clips de juego reales y auténticos cada semana — listos para descargar y publicar en Instagram, TikTok o YouTube sin ningún trabajo de tu equipo.',
      },
      {
        icon: 'whistle',
        title: 'Potencia clases privadas y entrenamientos',
        text: 'Convierte cada lección en una sesión de análisis. Durante la clase, cualquiera puede presionar el botón en la cancha para marcar un momento que valga la pena repasar — un gran punto, un error repetido, un ejercicio. Esos momentos aparecen resaltados en la grabación, así entrenadores y jugadores saltan directo a lo que importó y lo recortan para estudiar después. Tu academia ofrece análisis en video como una función estándar — no como un extra premium.',
      },
      {
        icon: 'broadcast',
        title: 'Transmisión en vivo para el público',
        text: 'Transmite en vivo desde cualquier cancha con un solo botón — sin cuentas externas ni configuración. La transmisión funciona automáticamente en la plataforma SmashVision y aparece al instante en la página pública de En Vivo. Transmite torneos, finales y noches de liga, y dale a los aficionados lejanos un asiento de primera fila.',
      },
      {
        icon: 'shield',
        title: 'Seguridad y visibilidad 24/7',
        text: 'Nuestras cámaras graban durante todo tu horario de operación — y de noche si lo solicitas — para que siempre sepas qué pasa en tus canchas. Usa el monitoreo privado para vigilar el club después del cierre, revisar incidentes y proteger tus instalaciones las 24 horas.',
      },
      {
        icon: 'chart',
        title: 'Estadísticas e insights',
        text: 'Un panel del club muestra los clips generados, los mejores puntos capturados y los minutos de video entregados en cualquier rango de fechas. Ve exactamente cuánto valor obtienen tus miembros de la plataforma — y cuánto contenido está acumulando tu club.',
      },
    ],

    howKicker: 'Cómo funciona',
    howSteps: [
      { icon: 'camera', title: 'Instalamos las cámaras', text: 'Cámaras profesionales se instalan en tus canchas y se conectan a internet mediante un túnel seguro — sin redireccionamiento de puertos ni dolores de cabeza de IT.' },
      { icon: 'bolt', title: 'Cada juego se graba solo', text: 'Los partidos se graban automáticamente durante tu horario y se suben a streaming seguro en la nube. Tu personal no hace nada.' },
      { icon: 'film', title: 'Los miembros ven, recortan y comparten', text: 'Los jugadores encuentran su juego por club, cancha, fecha y hora, lo vuelven a ver y crean clips con tu marca que descargan y comparten.' },
      { icon: 'chart', title: 'Tu club cosecha el valor', text: 'Obtienes una biblioteca de contenido, miembros comprometidos, repetición para entrenamientos, transmisión en vivo y visibilidad continua de las canchas — todo en un panel.' },
    ],

    adsKicker: 'Más allá del contenido',
    adsTitle: 'El video estructurado y con tu marca es inventario publicitario.',
    adsText:
      'Cada clip que generan tus miembros lleva marca de agua y se puede descargar — contenido de video estructurado que puedes ofrecer a patrocinadores y socios. Es un formato mucho más atractivo que los banners estáticos, y lo generan jugadores reales en tus canchas, cada semana. SmashVision convierte lo que ya sucede en tu club en un activo de marketing que te pertenece.',

    finalTitle: 'Ya tienes las canchas. Ya tienes los jugadores.',
    finalText: 'SmashVision convierte lo que ya está sucediendo en una plataforma que tus miembros aman y un activo de marketing que tu club posee. Déjanos mostrarte cómo funciona en tu club.',
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
