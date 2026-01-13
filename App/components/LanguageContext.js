import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    // Navigation
    home: "Home",
    aiCompanion: "AI Companion",
    exercises: "Exercises",
    playlists: "Playlists",
    consultations: "Consultations",
    profile: "Profile",
    login: "Log in",
    signUp: "Sign up",
    chooseNickname: "Choose your nickname",
    enterNickname: "Enter your nickname",

    // Home Page
    welcomeTitle: "Welcome to MindfulSpace",
    welcomeSubtitle: "A safe haven for your mental health. Get 24/7 AI support, practice wellness exercises, and connect with experts.",
    tagline: "Your Mental Wellness Journey Starts Here",

    // Quick Actions
    aiCompanionTitle: "AI Companion",
    aiCompanionDesc: "Chat with your 24/7 mental health companion. Always here to listen and support you.",
    startChatting: "Start Chatting",

    exercisesTitle: "Wellness Exercises",
    exercisesDesc: "Personalized activities for anxiety, stress relief, and building self-esteem.",
    browseExercises: "Browse Exercises",

    consultationsTitle: "Expert Consultations",
    consultationsDesc: "Book sessions with licensed mental health professionals when you need extra support.",
    bookSession: "Book Session",

    // Features
    safeConfidential: "Safe & Confidential",
    safeConfidentialDesc: "Your privacy matters. All conversations are completely confidential.",
    evidenceBased: "Evidence-Based",
    evidenceBasedDesc: "Techniques backed by psychology and mental health research.",
    alwaysAvailable: "Always Available",
    alwaysAvailableDesc: "24/7 support whenever you need someone to talk to.",

    // Crisis Support
    crisisSupport: "Crisis Support",
    crisisSupportText: "If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.",
    crisisHotline: "National Crisis Hotline: 988 (US) | Emergency: 911",

    // Chat Page
    alwaysHereToListen: "Always here to listen 💜",
    welcomeToSafeSpace: "Welcome to Your Safe Space",
    welcomeMessage: "I'm here to listen, support, and guide you. Feel free to share what's on your mind.",
    shareThoughts: "Share your thoughts...",
    aiSupportNote: "This AI companion provides support but is not a replacement for professional help",

    // Starter Questions
    starterQ1: "I'm feeling anxious today",
    starterQ2: "Help me with stress management",
    starterQ3: "I need a confidence boost",
    starterQ4: "Can we talk about my feelings?",

    // Exercises Page
    personalizedWellness: "Personalized Wellness Activities",
    guidedExercises: "Guided Exercises",
    exercisesSubtitle: "Evidence-based techniques to help manage anxiety, reduce stress, and build self-esteem",
    allExercises: "All Exercises",
    anxiety: "Anxiety",
    depression: "Depression",
    stress_management: "Stress Management",
    stress: "Stress",
    selfEsteem: "Self-Esteem",
    self_esteem: "Self-Esteem",
    relationships: "Relationships",
    trauma: "Trauma",
    general: "General",
    noExercises: "No exercises found in this category yet.",

    // Exercise Details
    aboutExercise: "About This Exercise",
    benefits: "Benefits",
    howToPractice: "How to Practice",
    minutes: "minutes",
    exerciseNote: "Remember: There's no right or wrong way to do this exercise. Take your time, be gentle with yourself, and notice how you feel.",

    // Playlists Page
    curatedWellbeing: "Curated for Your Wellbeing",
    relaxationPlaylists: "Relaxation Playlists",
    playlistsSubtitle: "Calming music and sounds to support your mental wellness journey",
    addPlaylist: "Add Playlist",
    all: "All",
    relaxation: "Relaxation",
    meditation: "Meditation",
    sleep: "Sleep",
    anxietyRelief: "Anxiety Relief",
    anxiety_relief: "Anxiety Relief",
    playOnSpotify: "Play on Spotify",
    noPlaylists: "No Playlists Yet",
    noPlaylistsDesc: "Add your favorite Spotify playlists to create a personalized relaxation library",
    addFirstPlaylist: "Add Your First Playlist",

    // Playlist Instructions
    howToAdd: "How to Add Spotify Playlists",
    spotifyStep1: "Open Spotify and find a playlist you love",
    spotifyStep2: "Click the share button (•••) and select \"Copy link to playlist\"",
    spotifyStep3: "Click \"Add Playlist\" above and paste the link",
    spotifyStep4: "Add a title, description, and category",

    // Consultations Page
    expertConsultations: "Expert Consultations",
    consultationsSubtitle: "Connect with licensed mental health professionals",
    bookConsultation: "Book Consultation",
    experts: "Experts",
    appointments: "Appointments",
    upcomingSessions: "Upcoming Sessions",
    pastSessions: "Past Sessions",
    joinSession: "Join Session",
    noConsultations: "No Consultations Yet",
    noConsultationsDesc: "Book your first session with a mental health expert to get personalized support",
    bookFirstSession: "Book Your First Session",
    noUpcoming: "No upcoming sessions",
    noPast: "No past sessions",

    // Status
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",

    // Forms
    cancel: "Cancel",
    save: "Save",
    update: "Update",
    add: "Add",
    edit: "Edit",
    delete: "Delete",

    clientProfile: "Client Profile",
    expertProfile: "Expert Profile",
    fullName: "Full name",
    degree: "Degree",
    credentials: "Credentials",
    yearsExperience: "Years of experience",
    languages: "Languages",
    bio: "Bio",
    availability: "Availability",
    photoUrl: "Photo URL",
    nickname: "Nickname",

    // Difficulty
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",

    // Categories
    moodBoost: "Mood Boost",
    natureSounds: "Nature Sounds",
    mood_boost: "Mood Boost",
    nature_sounds: "Nature Sounds",
    focus: "Focus",

    // Experts & Ratings
    findExperts: "Find Experts",
    myAppointments: "My Appointments",
    noExperts: "No Experts Available",
    noExpertsDesc: "Check back soon for available mental health professionals",
    rateYourSession: "Rate Your Session",
    howWasSession: "How was your session with",
    shareExperience: "Share your experience",
    optional: "optional",
    writeReview: "Write your review here...",
    submitRating: "Submit Rating",
    submitting: "Submitting...",
    rateSession: "Rate Session",
    yourRating: "Your Rating",
    rating1: "Poor",
    rating2: "Fair",
    rating3: "Good",
    rating4: "Very Good",
    rating5: "Excellent",
    expertName: "Expert Name",
    enterExpertName: "Enter expert name",
    specialization: "Specialization",
    bookingWith: "Booking with",
    date: "Date",
    time: "Time",
    meetingLink: "Meeting Link",
    notes: "Notes",
    consultationNotesPlaceholder: "What would you like to discuss?",
    saving: "Saving...",
    editConsultation: "Edit Consultation",
    browseExperts: "Browse Experts",
  },

  es: {
    // Navigation
    home: "Inicio",
    aiCompanion: "Compañero IA",
    exercises: "Ejercicios",
    playlists: "Listas",
    consultations: "Consultas",
    profile: "Perfil",
    login: "Ingresar",
    signUp: "Registrarse",
    chooseNickname: "Elige tu apodo",
    enterNickname: "Ingresa tu apodo",

    // Home Page
    welcomeTitle: "Bienvenido a MindfulSpace",
    welcomeSubtitle: "Un refugio seguro para tu salud mental. Obtén apoyo de IA 24/7, practica ejercicios de bienestar y conéctate con expertos.",
    tagline: "Tu Viaje de Bienestar Mental Comienza Aquí",

    // Quick Actions
    aiCompanionTitle: "Compañero IA",
    aiCompanionDesc: "Chatea con tu compañero de salud mental 24/7. Siempre aquí para escuchar y apoyarte.",
    startChatting: "Comenzar a Chatear",

    exercisesTitle: "Ejercicios de Bienestar",
    exercisesDesc: "Actividades personalizadas para ansiedad, alivio del estrés y desarrollo de autoestima.",
    browseExercises: "Explorar Ejercicios",

    consultationsTitle: "Consultas con Expertos",
    consultationsDesc: "Reserva sesiones con profesionales de salud mental licenciados cuando necesites apoyo adicional.",
    bookSession: "Reservar Sesión",

    // Features
    safeConfidential: "Seguro y Confidencial",
    safeConfidentialDesc: "Tu privacidad importa. Todas las conversaciones son completamente confidenciales.",
    evidenceBased: "Basado en Evidencia",
    evidenceBasedDesc: "Técnicas respaldadas por psicología e investigación en salud mental.",
    alwaysAvailable: "Siempre Disponible",
    alwaysAvailableDesc: "Apoyo 24/7 cuando necesites hablar con alguien.",

    // Crisis Support
    crisisSupport: "Apoyo en Crisis",
    crisisSupportText: "Si estás experimentando una emergencia de salud mental, por favor contacta servicios de emergencia o una línea de crisis inmediatamente.",
    crisisHotline: "Línea de Crisis Nacional: 988 (US) | Emergencia: 911",

    // Chat Page
    alwaysHereToListen: "Siempre aquí para escuchar 💜",
    welcomeToSafeSpace: "Bienvenido a Tu Espacio Seguro",
    welcomeMessage: "Estoy aquí para escuchar, apoyar y guiar. Siéntete libre de compartir lo que tienes en mente.",
    shareThoughts: "Comparte tus pensamientos...",
    aiSupportNote: "Este compañero IA proporciona apoyo pero no es un reemplazo para ayuda profesional",

    // Starter Questions
    starterQ1: "Me siento ansioso hoy",
    starterQ2: "Ayúdame con el manejo del estrés",
    starterQ3: "Necesito un impulso de confianza",
    starterQ4: "¿Podemos hablar sobre mis sentimientos?",

    // Exercises Page
    personalizedWellness: "Actividades de Bienestar Personalizadas",
    guidedExercises: "Ejercicios Guiados",
    exercisesSubtitle: "Técnicas basadas en evidencia para ayudar a manejar ansiedad, reducir estrés y construir autoestima",
    allExercises: "Todos los Ejercicios",
    anxiety: "Ansiedad",
    depression: "Depresión",
    stress_management: "Manejo del Estrés",
    stress: "Estrés",
    selfEsteem: "Autoestima",
    self_esteem: "Autoestima",
    relationships: "Relaciones",
    trauma: "Trauma",
    general: "General",
    noExercises: "No se encontraron ejercicios en esta categoría aún.",

    // Exercise Details
    aboutExercise: "Acerca de Este Ejercicio",
    benefits: "Beneficios",
    howToPractice: "Cómo Practicar",
    minutes: "minutos",
    exerciseNote: "Recuerda: No hay una forma correcta o incorrecta de hacer este ejercicio. Tómate tu tiempo, sé amable contigo mismo y observa cómo te sientes.",

    // Playlists Page
    curatedWellbeing: "Seleccionado para Tu Bienestar",
    relaxationPlaylists: "Listas de Relajación",
    playlistsSubtitle: "Música y sonidos tranquilizantes para apoyar tu viaje de bienestar mental",
    addPlaylist: "Añadir Lista",
    all: "Todas",
    relaxation: "Relajación",
    meditation: "Meditación",
    sleep: "Sueño",
    anxietyRelief: "Alivio de Ansiedad",
    anxiety_relief: "Alivio de Ansiedad",
    playOnSpotify: "Reproducir en Spotify",
    noPlaylists: "No Hay Listas Aún",
    noPlaylistsDesc: "Añade tus listas de Spotify favoritas para crear una biblioteca de relajación personalizada",
    addFirstPlaylist: "Añade Tu Primera Lista",

    // Playlist Instructions
    howToAdd: "Cómo Añadir Listas de Spotify",
    spotifyStep1: "Abre Spotify y encuentra una lista que te guste",
    spotifyStep2: "Haz clic en el botón compartir (•••) y selecciona \"Copiar enlace de lista\"",
    spotifyStep3: "Haz clic en \"Añadir Lista\" arriba y pega el enlace",
    spotifyStep4: "Añade un título, descripción y categoría",

    // Consultations Page
    expertConsultations: "Consultas con Expertos",
    consultationsSubtitle: "Conéctate con profesionales de salud mental licenciados",
    bookConsultation: "Reservar Consulta",
    experts: "Expertos",
    appointments: "Citas",
    upcomingSessions: "Sesiones Próximas",
    pastSessions: "Sesiones Pasadas",
    joinSession: "Unirse a Sesión",
    noConsultations: "No Hay Consultas Aún",
    noConsultationsDesc: "Reserva tu primera sesión con un experto en salud mental para obtener apoyo personalizado",
    bookFirstSession: "Reserva Tu Primera Sesión",
    noUpcoming: "Sin sesiones próximas",
    noPast: "Sin sesiones pasadas",

    // Status
    pending: "Pendiente",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",

    // Forms
    cancel: "Cancelar",
    save: "Guardar",
    update: "Actualizar",
    add: "Añadir",
    edit: "Editar",
    delete: "Eliminar",

    clientProfile: "Perfil de cliente",
    expertProfile: "Perfil de experto",
    fullName: "Nombre completo",
    degree: "Título",
    credentials: "Credenciales",
    yearsExperience: "Años de experiencia",
    languages: "Idiomas",
    bio: "Biografía",
    availability: "Disponibilidad",
    photoUrl: "URL de foto",
    nickname: "Apodo",

    // Difficulty
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",

    // Categories
    moodBoost: "Mejora de Ánimo",
    natureSounds: "Sonidos de la Naturaleza",
    mood_boost: "Mejora de Ánimo",
    nature_sounds: "Sonidos de la Naturaleza",
    focus: "Concentración",

    // Experts & Ratings
    findExperts: "Buscar Expertos",
    myAppointments: "Mis Citas",
    noExperts: "No Hay Expertos Disponibles",
    noExpertsDesc: "Vuelve pronto para ver profesionales de salud mental disponibles",
    rateYourSession: "Califica Tu Sesión",
    howWasSession: "¿Cómo fue tu sesión con",
    shareExperience: "Comparte tu experiencia",
    optional: "opcional",
    writeReview: "Escribe tu reseña aquí...",
    submitRating: "Enviar Calificación",
    submitting: "Enviando...",
    rateSession: "Calificar Sesión",
    yourRating: "Tu Calificación",
    rating1: "Deficiente",
    rating2: "Regular",
    rating3: "Bueno",
    rating4: "Muy Bueno",
    rating5: "Excelente",
    expertName: "Nombre del Experto",
    enterExpertName: "Ingresa el nombre del experto",
    specialization: "Especialización",
    bookingWith: "Reservando con",
    date: "Fecha",
    time: "Hora",
    meetingLink: "Enlace de Reunión",
    notes: "Notas",
    consultationNotesPlaceholder: "¿Qué te gustaría discutir?",
    saving: "Guardando...",
    editConsultation: "Editar Consulta",
    browseExperts: "Explorar Expertos",
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('app-language');
        if (storedLang) setLanguage(storedLang);
      } catch (error) {
        console.log('Error loading language from storage', error);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    const saveLanguage = async () => {
      try {
        await AsyncStorage.setItem('app-language', language);
      } catch (error) {
        console.log('Error saving language to storage', error);
      }
    };
    saveLanguage();
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations['es'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
