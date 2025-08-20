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
    recorded: 'Recorded',
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
    
    // Video view
    createClip: 'Create Clip of my Game!',
    startTime: 'Start Time',
    endTime: 'End Time',
    personalNote: 'Personal Note',
    blooper: 'Blooper',
    goodPoint: 'Good Point',
    forcedError: 'Forced Error',
    
    // Common
    language: 'Language'
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
    recorded: 'Grabado',
    status: 'Estado',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    download: 'Descargar',
    link: 'Enlace',
    notes: 'Notas',
    startLive: 'Iniciar En Vivo',
    stopLive: 'Detener En Vivo',
    connecting: 'Conectando...',
    stopping: 'Deteniendo...',
    clubDashboard: 'Panel del Club',
    memberDashboard: 'Panel del Miembro',
    clubAccount: 'Cuenta del Club',
    memberAccount: 'Cuenta del Miembro',
    
    // Video view
    createClip: '¡Crear Clip de mi Juego!',
    startTime: 'Tiempo Inicial',
    endTime: 'Tiempo Final',
    tag: 'Etiqueta',
    personalNote: 'Nota Personal',
    blooper: 'Error Gracioso',
    goodPoint: 'Buen Punto',
    forcedError: 'Error Forzado',
    
    // Common
    language: 'Idioma'
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