import { Link } from 'react-router-dom';

// Internal destinations kept as named constants (no inline routes)
const FIND_GAME_ROUTE = '/';
const LIVES_ROUTE = '/lives';

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
  search: (p) => (
    <svg {...iconBase} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  ),
  play: (p) => (
    <svg {...iconBase} {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" /></svg>
  ),
  scissors: (p) => (
    <svg {...iconBase} {...p}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8 7.5L20 18M8 16.5L20 6M14 12l-2-1.5" /></svg>
  ),
  download: (p) => (
    <svg {...iconBase} {...p}><path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 19h14" /></svg>
  ),
  star: (p) => (
    <svg {...iconBase} {...p}><path d="M12 4l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 15.9 7.3 18.2l.9-5.1-3.7-3.6 5.2-.8z" /></svg>
  ),
  broadcast: (p) => (
    <svg {...iconBase} {...p}><circle cx="12" cy="12" r="2.5" /><path d="M6.5 6.5a7.5 7.5 0 0 0 0 11M17.5 6.5a7.5 7.5 0 0 1 0 11M3.8 3.8a11.5 11.5 0 0 0 0 16.4M20.2 3.8a11.5 11.5 0 0 1 0 16.4" /></svg>
  ),
  folder: (p) => (
    <svg {...iconBase} {...p}><path d="M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>
  ),
  globe: (p) => (
    <svg {...iconBase} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>
  ),
  arrow: (p) => (
    <svg {...iconBase} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
};

/* --------------------------------- Content -------------------------------- */
const content = {
  en: {
    kicker: 'For Players',
    heroTitle: 'Relive every point.',
    heroTitleAccent: 'Share every moment.',
    heroText:
      'The cameras at your club record every game automatically — so the moment you step off the court, your match is already waiting for you. Watch it back, clip your best rallies, and download them to keep forever. No setup, no hassle, nothing to install.',
    heroCta: 'Find my game',
    heroCtaSecondary: 'Watch live matches',

    featuresKicker: 'What you can do',
    features: [
      {
        icon: 'search',
        title: 'Find your game in seconds',
        text: 'Just pick your club, court, date, and the hour you played. Your full match appears instantly — with a 7-day history so you never miss it. No login needed to search and watch.',
      },
      {
        icon: 'play',
        title: 'Watch your full match',
        text: 'Stream your entire game in high quality, with a live clock overlay that syncs the real-world time to what is happening on screen. Jump straight to the moments you marked on court with one click.',
      },
      {
        icon: 'scissors',
        title: 'Create highlight clips',
        text: 'Capture any moment as a 5–60 second clip. Tag it as a Good Point, Blooper, or Forced Error, add a personal note, and let the platform render it — branded and ready to share.',
      },
      {
        icon: 'download',
        title: 'Download & keep them forever',
        text: 'Every clip you make is yours to download as an MP4. Post it, send it to your group chat, or build your own highlight reel — the moment is yours to keep.',
      },
      {
        icon: 'star',
        title: 'Mark moments as you play',
        text: 'Nailed a great point? Press the button on the court to bookmark that moment. When you open your recording, every marked moment is highlighted and clickable as a Best Point — tap one to jump right to the rally and clip it, no scrubbing required.',
      },
      {
        icon: 'folder',
        title: 'Everything saved to your account',
        text: 'Every clip you create is stored in your personal Dashboard. Come back any time to rewatch, download, or share the highlights you have collected.',
      },
      {
        icon: 'broadcast',
        title: 'Watch matches live',
        text: 'Courts streaming right now show up on the Lives page. Pick any SmashVision club and watch live padel unfold in real time — perfect for following friends, finals, and tournaments.',
      },
      {
        icon: 'globe',
        title: 'In your language, zero setup',
        text: 'The whole experience works in English or Spanish and adapts to you automatically. There is nothing to install and nothing to configure — just show up, play, and relive it.',
      },
    ],

    howKicker: 'Getting started',
    howSteps: [
      { title: 'Play your game', text: 'Book and play at any SmashVision-equipped club. The cameras record your match automatically — you do not have to do a thing.' },
      { title: 'Find it online', text: 'Head to the app, select your club, court, date, and time, and your match loads instantly. Free to search and watch.' },
      { title: 'Clip & download', text: 'Sign in to create clips of your best moments, tag them, add notes, and download them as MP4s saved to your account.' },
    ],

    finalTitle: 'Your best game is already waiting for you.',
    finalText: 'Find the match you just played, relive every point, and take your highlights home.',
    finalCta: 'Find my game',
    clubLinkText: 'Run a padel club? See how SmashVision works for you →',
  },

  es: {
    kicker: 'Para Jugadores',
    heroTitle: 'Revive cada punto.',
    heroTitleAccent: 'Comparte cada momento.',
    heroText:
      'Las cámaras de tu club graban cada partido automáticamente — así que en el momento en que sales de la cancha, tu juego ya te está esperando. Vuelve a verlo, recorta tus mejores jugadas y descárgalas para guardarlas para siempre. Sin configuración, sin complicaciones, sin nada que instalar.',
    heroCta: 'Buscar mi juego',
    heroCtaSecondary: 'Ver partidos en vivo',

    featuresKicker: 'Lo que puedes hacer',
    features: [
      {
        icon: 'search',
        title: 'Encuentra tu juego en segundos',
        text: 'Solo elige tu club, cancha, fecha y la hora en que jugaste. Tu partido completo aparece al instante — con un historial de 7 días para que nunca te lo pierdas. No necesitas iniciar sesión para buscar y ver.',
      },
      {
        icon: 'play',
        title: 'Mira tu partido completo',
        text: 'Reproduce todo tu juego en alta calidad, con un reloj en vivo que sincroniza la hora real con lo que sucede en pantalla. Salta directo a los momentos que marcaste en la cancha con un clic.',
      },
      {
        icon: 'scissors',
        title: 'Crea clips de tus highlights',
        text: 'Captura cualquier momento como un clip de 5 a 60 segundos. Etiquétalo como Buen Punto, Blooper o Error Forzado, añade una nota personal y deja que la plataforma lo procese — con marca y listo para compartir.',
      },
      {
        icon: 'download',
        title: 'Descárgalos y guárdalos para siempre',
        text: 'Cada clip que creas es tuyo para descargar como MP4. Publícalo, envíalo a tu grupo de chat o arma tu propio reel de highlights — el momento es tuyo para conservarlo.',
      },
      {
        icon: 'star',
        title: 'Marca momentos mientras juegas',
        text: '¿Clavaste un gran punto? Presiona el botón en la cancha para marcar ese momento. Cuando abras tu grabación, cada momento marcado aparece resaltado y clicable como Mejor Punto — toca uno para saltar directo a la jugada y recortarla, sin tener que adelantar.',
      },
      {
        icon: 'folder',
        title: 'Todo guardado en tu cuenta',
        text: 'Cada clip que creas se almacena en tu Panel personal. Vuelve cuando quieras para volver a verlos, descargarlos o compartir los highlights que has coleccionado.',
      },
      {
        icon: 'broadcast',
        title: 'Mira partidos en vivo',
        text: 'Las canchas que están transmitiendo ahora mismo aparecen en la página de En Vivo. Elige cualquier club SmashVision y mira el pádel en vivo en tiempo real — perfecto para seguir a amigos, finales y torneos.',
      },
      {
        icon: 'globe',
        title: 'En tu idioma, sin configuración',
        text: 'Toda la experiencia funciona en inglés o español y se adapta a ti automáticamente. No hay nada que instalar ni configurar — solo llega, juega y revívelo.',
      },
    ],

    howKicker: 'Cómo empezar',
    howSteps: [
      { title: 'Juega tu partido', text: 'Reserva y juega en cualquier club equipado con SmashVision. Las cámaras graban tu partido automáticamente — no tienes que hacer nada.' },
      { title: 'Encuéntralo en línea', text: 'Entra a la app, selecciona tu club, cancha, fecha y hora, y tu partido carga al instante. Gratis para buscar y ver.' },
      { title: 'Recorta y descarga', text: 'Inicia sesión para crear clips de tus mejores momentos, etiquétalos, añade notas y descárgalos como MP4 guardados en tu cuenta.' },
    ],

    finalTitle: 'Tu mejor juego ya te está esperando.',
    finalText: 'Encuentra el partido que acabas de jugar, revive cada punto y llévate tus highlights a casa.',
    finalCta: 'Buscar mi juego',
    clubLinkText: '¿Diriges un club de pádel? Descubre cómo funciona SmashVision para ti →',
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

// Rendered as a tab inside the About page (see About.jsx).
export function PlayersAbout({ language, onSwitchToClubs }) {
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
            <Link
              to={FIND_GAME_ROUTE}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {c.heroCta}
              <Icons.arrow width="18" height="18" />
            </Link>
            <Link
              to={LIVES_ROUTE}
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 font-medium px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              {c.heroCtaSecondary}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionKicker>{c.featuresKicker}</SectionKicker>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.features.map((f) => {
              const Icon = Icons[f.icon];
              return (
                <div
                  key={f.title}
                  className="group backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#DDF31A]/25"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#DDF31A]/10 border border-[#DDF31A]/20 flex items-center justify-center text-[#DDF31A] mb-5 transition-transform duration-300 group-hover:scale-105">
                    <Icon width="24" height="24" />
                  </div>
                  <h3 className="text-base font-semibold text-white/90 mb-2.5">{f.title}</h3>
                  <p className="text-white/55 leading-relaxed text-sm">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How to get started */}
        <section className="mt-24 lg:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionKicker>{c.howKicker}</SectionKicker>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {c.howSteps.map((s, i) => (
              <div key={s.title} className="relative backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-7">
                <div className="w-10 h-10 rounded-full bg-[#DDF31A]/15 border border-[#DDF31A]/30 flex items-center justify-center text-[#DDF31A] font-bold mb-5">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">{s.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-24 lg:mt-32">
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#DDF31A]/[0.07] to-white/[0.03] border border-[#DDF31A]/20 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 leading-snug max-w-2xl mx-auto">
              {c.finalTitle}
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">{c.finalText}</p>
            <div className="mt-10">
              <Link
                to={FIND_GAME_ROUTE}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black font-semibold px-10 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {c.finalCta}
                <Icons.arrow width="18" height="18" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onSwitchToClubs}
              className="text-white/40 hover:text-[#DDF31A] text-sm transition-colors"
            >
              {c.clubLinkText}
            </button>
          </div>
        </section>
    </>
  );
}
