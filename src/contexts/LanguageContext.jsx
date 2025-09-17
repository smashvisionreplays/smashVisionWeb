import React, { createContext, useContext, useState } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: 'Home',
    dashboard: 'Dashboard',
    tournaments: 'Tournaments',
    lives: 'Lives',
    
    // Home page
    findYourGame: 'Find Your Game',
    gameDescription: 'Search and watch your padel matches by selecting your club, court, and game time. Relive your best moments and analyze your gameplay.',
    feature1: 'Live matches available',
    feature2: '7-day history',
    club: 'Club',
    court: 'Court',
    date: 'Date',
    time: 'Time',
    findMyGame: 'Find My Game',
    searching: 'Searching...',
    selectClub: 'Select your club',
    selectCourt: 'Select court number',
    selectDate: 'Please select the date!',
    selectTime: 'Please select the time!',
    fillAllFields: 'Please fill in all fields',
    videoNotFound: 'Video Not Found',
    noVideoAvailable: 'No video available for the selected time and court',
    failedToLoadClubs: 'Failed to load clubs',
    failedToLoadCourts: 'Failed to load courts',
    failedToFetchVideo: 'Failed to fetch video',
    
    // Dashboard
    myClips: 'My Clips',
    descriptionPanel: 'Manage and monitor activity on your',
    clipName: 'Clip Name',
    createdAt: 'Created At',
    duration: 'Duration',
    tags: 'Tags',
    actions: 'Actions',
    watch: 'Watch',
    delete: 'Delete',
    edit: 'Edit',
    noClips: 'No clips found',
    loading: 'Loading...',
    day: 'Day',
    hour: 'Hour',
    status: 'Status',
    block: 'Block',
    unblock: 'Unblock',
    tag: 'Tag',
    download: 'Download',
    link: 'Link',
    notes: 'Notes',
    startLive: 'Start Live',
    stopLive: 'Stop Live',
    connecting: 'Connecting...',
    stopping: 'Stopping...',
    clubDashboard: 'Club Dashboard',
    memberDashboard: 'Member Dashboard',
    clubAccount: 'Club Account',
    memberAccount: 'Member Account',
    blocked: 'Blocked',
    unblocked: 'Unblocked',
    recorded: 'Recorded',
    notRecorded: 'Not Recorded',
    
    // Video view
    createClip: 'Create Clip of my Game!',
    startTime: 'Start Time',
    endTime: 'End Time',
    personalNote: 'Personal Note',
    blooper: 'Blooper',
    goodPoint: 'Good Point',
    forcedError: 'Forced Error',
    bestMoments: 'Best Moments',
    useButtonToGetTime: 'Use the button to get current time in the video.',
    classifyYourClip: 'Classify your clip',
    selectATag: 'Select a tag',
    makeNoteForClip: 'Make a note for yourself about this clip.',
    
    // ClipView progress steps
    creatingClip: 'Creating Clip',
    videoBeingClipped: 'Video is being clipped',
    downloadStep: 'Download',
    generatingDownloadLink: 'Generating link to download video locally',
    savingInAccount: 'Saving in Account',
    clipSavedInAccount: 'The clip has been saved in your account',
    downloadVideo: 'Download Video',
    
    // Lives page
    liveStreams: 'Live Streams',
    liveStreamsDescription: 'Watch live padel matches from clubs around the world. Select a club to see their active courts.',
    selectClubLive: 'Select Club',
    chooseClubPlaceholder: 'Choose a club to view live streams',
    liveCourts: 'Live Courts',
    noLiveStreamingFound: 'No live streaming found',
    clickToWatchFullScreen: 'Click to watch full screen',
    offline: 'Offline',
    noCamerasFound: 'No cameras found',
    noCamerasDescription: "This club doesn't have any cameras set up yet.",
    liveStreamTitle: 'Live Stream',
    
    // YouTube Status
    youtubeConnected: 'Connected',
    youtubeNotConnected: 'Not Connected',
    connect: 'Connect YouTube',
    disconnect: 'Disconnect',
    
    // Empty State
    noTypeAvailable: 'No {type} available',
    noTypeCurrently: 'There are currently no {type} available. Check back later or contact support if you believe this is an error.',

    // Common
    language: 'Language',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday'
  },
  es: {
    // Navbar
    home: 'Inicio',
    dashboard: 'Panel de Control',
    tournaments: 'Torneos',
    lives: 'En Vivo',
    
    // Home page
    findYourGame: 'Encuentra Tu Juego',
    gameDescription: 'Busca y mira tus partidos de pádel seleccionando tu club, cancha y hora de juego. Revive tus mejores momentos y analiza tu juego.',
    feature1: 'Partidos en vivo disponibles',
    feature2: 'Historial de 7 días',
    club: 'Club',
    court: 'Cancha',
    date: 'Fecha',
    time: 'Hora',
    findMyGame: 'Buscar Mi Juego',
    searching: 'Buscando...',
    selectClub: 'Selecciona tu club',
    selectCourt: 'Selecciona número de cancha',
    selectDate: '¡Por favor selecciona la fecha!',
    selectTime: '¡Por favor selecciona la hora!',
    fillAllFields: 'Por favor completa todos los campos',
    videoNotFound: 'Video No Encontrado',
    noVideoAvailable: 'No hay video disponible para la hora y cancha seleccionadas',
    failedToLoadClubs: 'Error al cargar clubes',
    failedToLoadCourts: 'Error al cargar canchas',
    failedToFetchVideo: 'Error al obtener video',
    
    // Dashboard
    myClips: 'Mis Clips',
    descriptionPanel: 'Gestiona y monitorea la actividad en tus',
    clipName: 'Nombre del Clip',
    createdAt: 'Creado el',
    duration: 'Duración',
    tags: 'Etiquetas',
    actions: 'Acciones',
    watch: 'Ver',
    delete: 'Eliminar',
    edit: 'Editar',
    noClips: 'No se encontraron clips',
    loading: 'Cargando...',
    day: 'Día',
    hour: 'Hora',
    status: 'Estado',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    download: 'Descargar',
    link: 'Enlace',
    notes: 'Notas',
    startLive: 'Iniciar Live',
    stopLive: 'Detener Live',
    connecting: 'Conectando...',
    stopping: 'Deteniendo...',
    clubDashboard: 'Panel del Club',
    memberDashboard: 'Panel del Miembro',
    clubAccount: 'Cuenta del Club',
    memberAccount: 'Cuenta del Miembro',
    blocked: 'Bloqueado',
    unblocked: 'Desbloqueado',
    recorded: 'Grabado',
    notRecorded: 'No Grabado',
    
    // Video view
    createClip: '¡Crear Clip de mi Juego!',
    startTime: 'Tiempo Inicial',
    endTime: 'Tiempo Final',
    tag: 'Etiqueta',
    personalNote: 'Nota Personal',
    blooper: 'Blooper',
    goodPoint: 'Buen Punto',
    forcedError: 'Error Forzado',
    bestMoments: 'Mejores Momentos',
    useButtonToGetTime: 'Usa el botón para obtener el tiempo actual en el video.',
    classifyYourClip: 'Clasifica tu clip',
    selectATag: 'Selecciona una etiqueta',
    makeNoteForClip: 'Haz una nota para ti sobre este clip.',
    
    // ClipView progress steps
    creatingClip: 'Creando Clip',
    videoBeingClipped: 'El video está siendo recortado',
    downloadStep: 'Descarga',
    generatingDownloadLink: 'Generando enlace para descargar video localmente',
    savingInAccount: 'Guardando en Cuenta',
    clipSavedInAccount: 'El clip ha sido guardado en tu cuenta',
    downloadVideo: 'Descargar Video',
    
    // Lives page
    liveStreams: 'Transmisiones en Vivo',
    liveStreamsDescription: 'Mira partidos de pádel en vivo de clubes de todo el mundo. Selecciona un club para ver sus canchas activas.',
    selectClubLive: 'Seleccionar Club',
    chooseClubPlaceholder: 'Elige un club para ver transmisiones en vivo',
    liveCourts: 'Canchas en Vivo',
    noLiveStreamingFound: 'No se encontró transmisión en vivo',
    clickToWatchFullScreen: 'Haz clic para ver en pantalla completa',
    offline: 'Desconectado',
    noCamerasFound: 'No se encontraron cámaras',
    noCamerasDescription: 'Este club aún no tiene cámaras configuradas.',
    liveStreamTitle: 'Transmisión en Vivo',
    
    // YouTube Status
    youtubeConnected: 'Conectado',
    youtubeNotConnected: 'No Conectado',
    connect: 'Conectar YouTube',
    disconnect: 'Desconectar',
    
    // Empty State
    noTypeAvailable: 'No hay {type} disponibles',
    noTypeCurrently: 'Actualmente no hay {type} disponibles. Vuelve más tarde o contacta soporte si crees que esto es un error.',

    // Common
    language: 'Idioma',
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo'
  }
};

const antdLocales = {
  en: enUS,
  es: esES
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ConfigProvider locale={antdLocales[language]}>
        {children}
      </ConfigProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};