import React, { createContext, useContext, useState, useEffect } from 'react';
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
    about: 'About',
    forClubs: 'For Clubs',
    forPlayers: 'For Players',
    
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
    loadingClubs: 'Loading clubs...',
    loadingCourts: 'Loading courts...',

    // Dashboard
    myClips: 'Clips',
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
    deleteClip: 'Delete',
    deleteClipTitle: 'Delete Clip',
    deleteClipConfirmLabel: 'Type "delete" to confirm',
    deleteClipConfirmPlaceholder: 'delete',
    deleteClipWarning: 'This action is permanent. The clip will be removed permanently from your account.',
    deleteClipSuccess: 'Clip deleted successfully.',
    deleteClipError: 'Failed to delete clip. Please try again.',
    accessRestricted: 'Access Restricted',
    accessRestrictedBody: 'This section is not available for your account.',
    // Admin panel — outdated Cloudflare recordings
    adminPanel: 'Admin',
    adminAccount: 'Admin Account',
    adminExplainer: 'Recordings live 7 days and are then removed automatically. Anything listed here outlived that, and the Reason column says why — hover it for detail. Clips saved by members are never listed and can never be deleted from here.',
    adminStorageUsed: 'Cloudflare storage',
    adminOfLimit: 'of {limit} minutes',
    adminMinutes: 'min',
    adminOutdatedCount: 'Outdated videos',
    adminReclaimable: 'Space to reclaim',
    adminOrphan: 'Unregistered',
    adminOrphanHint: 'Uploaded to Cloudflare but never recorded in the database — the platform never knew it existed.',
    adminDeleteFailed: 'Delete failed',
    adminDeleteFailedHint: 'The cleanup unlinked this recording as it should, but the Cloudflare delete did not go through.',
    adminStale: 'Not cleaned up',
    adminStaleHint: 'Still linked to a court and time slot past its 7 days — the cleanup never unlinked it.',
    adminTruncated: 'Showing the first pages only — there is more than this list can load at once. Delete these and refresh to see the rest.',
    adminOlderThan: 'Older than',
    adminDays: 'days',
    adminDaysOld: '{days} days old',
    adminRefresh: 'Refresh',
    adminCreated: 'Recorded',
    adminDay: 'Day',
    adminUnformatted: 'Unrecognised name',
    adminSelectAllFiltered: 'Select all {count} matching',
    adminClearSelection: 'Clear selection',
    adminSelectedHidden: '{count} of these are hidden by the current filters',
    adminType: 'Reason',
    adminSlot: 'Slot',
    adminDuration: 'Length',
    adminSize: 'Size',
    adminSelectedCount: '{count} selected',
    adminDeleteSelected: 'Delete permanently',
    adminConfirmTitle: 'Delete videos from Cloudflare',
    adminConfirmBody: 'You are about to permanently delete {count} video(s), freeing about {size}.',
    adminConfirmWarning: 'This cannot be undone. The files are removed from Cloudflare, not just hidden. Anything still within the 7-day window, and any clip saved by a member, is refused automatically.',
    adminDeletingProgress: 'Deleting {done} of {total}...',
    adminDeleted: 'deleted',
    adminSkipped: 'skipped',
    adminFailed: 'failed',
    adminDeleteSuccess: 'Videos deleted.',
    adminDeletePartial: 'Some videos could not be deleted.',
    adminNoneTitle: 'Nothing outdated',
    adminNoneBody: 'Every recording in Cloudflare is within its 7-day life. The cleanup is keeping up.',
    adminLoadError: 'Could not load outdated videos.',
    adminLoadErrorHint: 'The Cloudflare list could not be read, so this is not a confirmation that storage is clear. Try refreshing.',
    link: 'Link',
    notes: 'Notes',
    startLive: 'Start Live',
    stopLive: 'Stop Live',
    enableLive: 'Enable Live',
    disableLive: 'Disable Live',
    enabling: 'Enabling...',
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
    createClipSimple: 'Create Clip',
    previousVideo: 'Previous',
    nextVideo: 'Next',
    clearAllFields: 'Clear All Fields',
    bestPoints: 'Best Points',
    loginToCreateClip: 'Login to Create Clip',
    signInRequired: 'Sign In Required',
    signInToCreateClips: 'You need to sign in to create clips',
    startTime: 'Start Time',
    endTime: 'End Time',
    personalNote: 'Personal Note',
    noNotesFound: 'No notes were found for this clip.',
    blooper: 'Blooper',
    goodPoint: 'Good Point',
    forcedError: 'Forced Error',
    bestMoments: 'Best Moments',
    bestPointsTooltip: 'Clicking a best point will automatically set the start time to -1 min and end time to +1 min around that moment.',
    clipTimesRelativeToVideo: 'Times are relative to the video start, not the real clock.',
    useButtonToGetTime: 'Use the "Set" button to get the current time in the video.',
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
    clipReadyTitle: 'Your clip is ready!',
    clipReadyDescription: 'The clip has been processed and saved in your account. You can find it anytime in your dashboard and download it from there.',
    goToDashboard: 'Go to Dashboard',

    // Lives page
    liveStreams: 'Live Streams',
    liveStreamsDescription: 'Watch live padel matches from clubs around the world. Select a club to see their active courts.',
    selectClubLive: 'Select Club',
    chooseClubPlaceholder: 'Choose a club to view live streams',
    selectClubToSeeLives: 'Select a club above to see its live streams',
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

    // Statistics
    statistics: 'Statistics',
    selectDateRange: 'Select Date Range',
    clipsGenerated: 'Clips Generated',
    bestPointsGenerated: 'Best Points Generated',
    totalClips: 'Total Clips',
    totalBestPoints: 'Total Best Points',
    minutesDelivered: 'Minutes Delivered',
    totalMinutesDelivered: 'Total minutes delivered',
    metricsUpdatedDaily: 'Metrics updated daily · Data available through yesterday',
    videoBreakdown: 'Per-video breakdown',
    noMinutesData: 'No minutes data available for this period',
    minutesTrackingNote: 'Minutes-delivered tracking started on {date}. Totals only include video recorded from that date up to your selected end date — games played before it are not counted.',
    date: 'Date',
    court: 'Court',
    time: 'Time',
    minutes: 'min',
    total: 'Total',

    // CreateClipBox validation
    clipTimeOutOfRange: 'Clip start or end time cannot be out of video total times',
    videoDurationUnavailable: 'Video duration not available, reload the page',
    clipTooShort: 'Clip duration must be longer than {min} seconds',
    clipTooLong: 'Clip duration cannot be longer than {max} seconds',
    startTimeRequired: 'Start time is required.',
    endTimeRequired: 'End time is required.',
    tagRequired: 'Tag is required.',
    userInfoUnavailable: 'User information not available. Please try logging in again.',
    invalidTimeFormat: 'Please enter valid times in m:ss format (e.g. 1:30)',

    // Error notifications
    failedToLoadUserData: 'Failed to load user data',
    failedToLoadClip: 'There was an error loading the clip, you might want to reload the page.',
    failedToToggleLiveStatus: 'Failed to toggle live status',
    clubServerUnavailable: 'Club Server Unavailable',
    streamStartFailed: 'Stream Start Failed',
    streamStopFailed: 'Stream Stop Failed',
    clipCreationFailedCloudflare: 'Clip creation failed due to a problem with the cloud media provider. Please try again.',
    clipCreationFailedDatabase: 'Clip creation failed due to a problem with the database. Please try again.',
    clipCreationFailed: 'Clip creation failed. Please try again.',
    
    // Login page
    welcomeToSmashVision: 'Welcome to SmashVision',
    createAccount: 'Create your account',
    signInToAccount: 'Sign in to access your account',
    manageContent: 'and manage your padel content',
    alreadyHaveAccount: 'Already have an account? Sign in',
    dontHaveAccount: "Don't have an account? Sign up",
    continueWithGoogle: 'Continue with Google',
    
    // Common
    language: 'Language',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',

    //Login
    continueWith: 'Continue with {{provider}}',
    or: 'or',
    emailAddress: 'Email address',
    password: 'Password',
    continue: 'Continue',
    forgotPassword: 'Forgot password?',
    signInTitle: 'Sign in',
    signInSubtitle: 'to continue to SmashVision',
    signUpTitle: 'Create account',
    signUpSubtitle: 'to continue to SmashVision',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Sign up',
    signIn: 'Sign in',
    signInBoxSubtitle: 'Log in your account to access your dashboard and content',
    signUpBoxSubtitle: 'Create an account to access your dashboard and content',
    enterPassword: 'Enter your password',
    enterPasswordSubtitle: 'Enter the password associated with your account',
    otpSpamNote: 'Check your spam folder if you don\'t see it in your inbox.',
    otpSpamNoteCss: 'Check spam if not in inbox',
    otpResendButton: 'Didn\'t receive a code? Resend',

    // Footer
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    contactUs: 'Contact Us',
  },

  es: {
    // Navbar
    home: 'Inicio',
    dashboard: 'Panel de Control',
    tournaments: 'Torneos',
    lives: 'En Vivo',
    about: 'Nosotros',
    forClubs: 'Para Clubes',
    forPlayers: 'Para Jugadores',
    
    // Home page
    findYourGame: 'Encuentra Tu Juego',
    gameDescription: 'Busca y mira tus partidos de pádel seleccionando tu club, cancha y hora de juego. Revive tus mejores momentos y analiza tu juego.',
    feature1: 'Partidos en vivo',
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
    loadingClubs: 'Cargando clubes...',
    loadingCourts: 'Cargando canchas...',

    // Dashboard
    myClips: 'Clips',
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
    deleteClip: 'Eliminar',
    deleteClipTitle: 'Eliminar Clip',
    deleteClipConfirmLabel: 'Escribe "eliminar" para confirmar',
    deleteClipConfirmPlaceholder: 'eliminar',
    deleteClipWarning: 'Esta acción es permanente. El clip será eliminado permanentemente de tu cuenta.',
    deleteClipSuccess: 'Clip eliminado correctamente.',
    deleteClipError: 'Error al eliminar el clip. Inténtalo de nuevo.',
    accessRestricted: 'Acceso Restringido',
    accessRestrictedBody: 'Esta sección no está disponible para tu cuenta.',
    // Panel de administración — grabaciones vencidas en Cloudflare
    adminPanel: 'Administración',
    adminAccount: 'Cuenta de Administrador',
    adminExplainer: 'Las grabaciones duran 7 días y luego se eliminan automáticamente. Lo que aparece aquí sobrevivió a ese plazo, y la columna Motivo indica por qué — pasa el cursor para ver el detalle. Los clips guardados por los miembros nunca se listan ni se pueden eliminar desde aquí.',
    adminStorageUsed: 'Almacenamiento en Cloudflare',
    adminOfLimit: 'de {limit} minutos',
    adminMinutes: 'min',
    adminOutdatedCount: 'Videos vencidos',
    adminReclaimable: 'Espacio por liberar',
    adminOrphan: 'Sin registrar',
    adminOrphanHint: 'Subido a Cloudflare pero nunca registrado en la base de datos — la plataforma nunca supo que existía.',
    adminDeleteFailed: 'Falló al eliminar',
    adminDeleteFailedHint: 'La limpieza desvinculó la grabación como corresponde, pero la eliminación en Cloudflare no se completó.',
    adminStale: 'Sin limpiar',
    adminStaleHint: 'Sigue vinculada a una cancha y franja horaria pasados sus 7 días — la limpieza nunca la desvinculó.',
    adminTruncated: 'Mostrando solo las primeras páginas — hay más de lo que esta lista puede cargar de una vez. Elimina estos y actualiza para ver el resto.',
    adminOlderThan: 'Más de',
    adminDays: 'días',
    adminDaysOld: '{days} días',
    adminRefresh: 'Actualizar',
    adminCreated: 'Grabado',
    adminDay: 'Día',
    adminUnformatted: 'Nombre no reconocido',
    adminSelectAllFiltered: 'Seleccionar los {count} coincidentes',
    adminClearSelection: 'Limpiar selección',
    adminSelectedHidden: '{count} de estos están ocultos por los filtros actuales',
    adminType: 'Motivo',
    adminSlot: 'Franja',
    adminDuration: 'Duración',
    adminSize: 'Tamaño',
    adminSelectedCount: '{count} seleccionados',
    adminDeleteSelected: 'Eliminar permanentemente',
    adminConfirmTitle: 'Eliminar videos de Cloudflare',
    adminConfirmBody: 'Estás a punto de eliminar permanentemente {count} video(s), liberando cerca de {size}.',
    adminConfirmWarning: 'Esto no se puede deshacer. Los archivos se eliminan de Cloudflare, no solo se ocultan. Todo lo que aún esté dentro de los 7 días, y cualquier clip guardado por un miembro, se rechaza automáticamente.',
    adminDeletingProgress: 'Eliminando {done} de {total}...',
    adminDeleted: 'eliminados',
    adminSkipped: 'omitidos',
    adminFailed: 'fallidos',
    adminDeleteSuccess: 'Videos eliminados.',
    adminDeletePartial: 'Algunos videos no se pudieron eliminar.',
    adminNoneTitle: 'Nada vencido',
    adminNoneBody: 'Todas las grabaciones en Cloudflare están dentro de sus 7 días de vida. La limpieza está al día.',
    adminLoadError: 'No se pudieron cargar los videos vencidos.',
    adminLoadErrorHint: 'No se pudo leer la lista de Cloudflare, así que esto no confirma que el almacenamiento esté libre. Intenta actualizar.',
    link: 'Enlace',
    notes: 'Notas',
    startLive: 'Iniciar Live',
    stopLive: 'Detener Live',
    enableLive: 'Habilitar Live',
    disableLive: 'Deshabilitar Live',
    enabling: 'Habilitando...',
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
    createClipSimple: 'Crear Clip',
    previousVideo: 'Anterior',
    nextVideo: 'Siguiente',
    clearAllFields: 'Limpiar Todo',
    bestPoints: 'Mejores Puntos',
    loginToCreateClip: 'Inicia Sesión para Crear Clip',
    signInRequired: 'Inicio de Sesión Requerido',
    signInToCreateClips: 'Necesitas iniciar sesión para crear clips',
    startTime: 'Tiempo Inicial',
    endTime: 'Tiempo Final',
    tag: 'Etiqueta',
    personalNote: 'Nota Personal',
    noNotesFound: 'No se encontraron notas para este clip.',
    blooper: 'Blooper',
    goodPoint: 'Buen Punto',
    forcedError: 'Error Forzado',
    bestMoments: 'Mejores Momentos',
    bestPointsTooltip: 'Al hacer clic en un mejor punto, el tiempo de inicio se ajustará a -1 min y el tiempo final a +1 min automáticamente.',
    clipTimesRelativeToVideo: 'Los tiempos son relativos al inicio del video, no al reloj real.',
    useButtonToGetTime: 'Usa el botón "Set" para obtener el tiempo actual en el video.',
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
    clipReadyTitle: '¡Tu clip está listo!',
    clipReadyDescription: 'El clip ha sido procesado y guardado en tu cuenta. Puedes encontrarlo en cualquier momento en tu panel y descargarlo desde allí.',
    goToDashboard: 'Ir al Panel',

    // Lives page
    liveStreams: 'Transmisiones en Vivo',
    liveStreamsDescription: 'Mira partidos de pádel en vivo de clubes de todo el mundo. Selecciona un club para ver sus canchas activas.',
    selectClubLive: 'Seleccionar Club',
    chooseClubPlaceholder: 'Elige un club para ver transmisiones en vivo',
    selectClubToSeeLives: 'Selecciona un club arriba para ver sus transmisiones en vivo',
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

    // Statistics
    statistics: 'Estadísticas',
    selectDateRange: 'Seleccionar Rango de Fechas',
    clipsGenerated: 'Clips Generados',
    bestPointsGenerated: 'Mejores Puntos Generados',
    totalClips: 'Total de Clips',
    totalBestPoints: 'Total de Mejores Puntos',
    minutesDelivered: 'Minutos Entregados',
    totalMinutesDelivered: 'Total de minutos entregados',
    metricsUpdatedDaily: 'Métricas actualizadas a diario · Datos disponibles hasta ayer',
    videoBreakdown: 'Desglose por video',
    noMinutesData: 'No hay datos de minutos para este periodo',
    minutesTrackingNote: 'El registro de minutos entregados comenzó el {date}. Los totales solo incluyen el video grabado desde esa fecha hasta la fecha final que seleccionaste; los partidos anteriores no se cuentan.',
    date: 'Fecha',
    court: 'Cancha',
    time: 'Hora',
    minutes: 'min',
    total: 'Total',

    // CreateClipBox validation
    clipTimeOutOfRange: 'El tiempo de inicio o fin del clip no puede estar fuera del video',
    videoDurationUnavailable: 'Duración del video no disponible, recarga la página',
    clipTooShort: 'La duración del clip debe ser mayor a {min} segundos',
    clipTooLong: 'La duración del clip no puede ser mayor a {max} segundos',
    startTimeRequired: 'El tiempo de inicio es obligatorio.',
    endTimeRequired: 'El tiempo de fin es obligatorio.',
    tagRequired: 'La etiqueta es obligatoria.',
    userInfoUnavailable: 'Información de usuario no disponible. Por favor inicia sesión de nuevo.',
    invalidTimeFormat: 'Por favor ingresa tiempos válidos en formato m:ss (ej. 1:30)',

    // Error notifications
    failedToLoadUserData: 'Error al cargar los datos del usuario',
    failedToLoadClip: 'Hubo un error al cargar el clip, puede que quieras recargar la página.',
    failedToToggleLiveStatus: 'Error al cambiar el estado del streaming',
    clubServerUnavailable: 'Servidor del Club No Disponible',
    streamStartFailed: 'Error al Iniciar Transmisión',
    streamStopFailed: 'Error al Detener Transmisión',
    clipCreationFailedCloudflare: 'Error al crear el clip por un problema con el proveedor de medios en la nube. Inténtalo de nuevo.',
    clipCreationFailedDatabase: 'Error al crear el clip por un problema con la base de datos. Inténtalo de nuevo.',
    clipCreationFailed: 'Error al crear el clip. Inténtalo de nuevo.',
    
    // Login page
    welcomeToSmashVision: 'Bienvenido a SmashVision',
    createAccount: 'Crea tu cuenta',
    signInToAccount: 'Inicia sesión para acceder a tu cuenta',
    manageContent: 'y gestiona tu contenido de pádel',
    alreadyHaveAccount: '¿Ya tienes una cuenta? Inicia sesión',
    dontHaveAccount: '¿No tienes una cuenta? Regístrate',
    continueWithGoogle: 'Continuar con Google',
    
    // Common
    language: 'Idioma',
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',

    //Login
    continueWith: 'Continuar con {{provider}}',
    or: 'o',
    emailAddress: 'Correo electrónico',
    password: 'Contraseña',
    continue: 'Continuar',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signInTitle: 'Iniciar sesión',
    signInSubtitle: 'para continuar a SmashVision',
    signUpTitle: 'Crear cuenta',
    signUpSubtitle: 'para continuar a SmashVision',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    signUp: 'Regístrate',
    signIn: 'Iniciar sesión',
    signInBoxSubtitle: 'Inicia sesión para acceder a tu panel y contenido',
    signUpBoxSubtitle: 'Crea una cuenta para acceder a tu panel y contenido',
    enterPassword: 'Ingresa tu contraseña',
    enterPasswordSubtitle: 'Ingresa la contraseña asociada a tu cuenta',
    otpSpamNote: 'Revisa tu carpeta de spam si no lo encuentras en tu bandeja de entrada.',
    otpSpamNoteCss: 'Revisa tu carpeta de spam',
    otpResendButton: '¿No recibiste el código? Reenviar',

    // Footer
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de Uso',
    contactUs: 'Contáctanos',
  }
};

const antdLocales = {
  en: enUS,
  es: esES
};

// Spanish-speaking countries
const spanishCountries = ['ES', 'MX', 'CO', 'AR', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ'];

const detectLanguageFromLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return spanishCountries.includes(data.country_code) ? 'es' : 'en';
  } catch {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const initializeLanguage = async () => {
      const detectedLanguage = await detectLanguageFromLocation();
      setLanguage(detectedLanguage);
    };
    
    initializeLanguage();
  }, []);

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