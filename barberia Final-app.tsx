tadassoimport React, { useState, useEffect, useMemo } from 'react';
import { Scissors, Settings, Info, BookOpen, Camera, Wrench, Calendar, Star, DollarSign, Menu, X, ChevronRight, MessageCircle, Share2, Eye, CreditCard, Heart, ThumbsUp, User, LogOut } from 'lucide-react';

const Header = ({ config, setShowConfigModal, menuOpen, setMenuOpen, user, logout, setShowLoginModal, notificationPermission, setShowNotificationSettings }) => (
  <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Scissors className="text-blue-500" size={28} />
        <h1 className="text-2xl font-bold">{config.businessName}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowConfigModal(true)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
          <Settings size={20} />
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <User size={16} />
              <span>{user.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {user.role === 'admin' ? 'Admin' : 'Usuario'}
              </span>
            </div>
            <button onClick={logout} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLoginModal(true)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
            <User size={20} />
          </button>
        )}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Botón de notificaciones */}
        {'Notification' in window && (
          <button
            onClick={() => setShowNotificationSettings(true)}
            className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 relative ${
              notificationPermission === 'granted' ? 'text-green-400' :
              notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
            }`}
            title={
              notificationPermission === 'granted' ? 'Notificaciones activas' :
              notificationPermission === 'denied' ? 'Notificaciones bloqueadas' :
              'Configurar notificaciones'
            }
          >
            🔔
            {notificationPermission === 'default' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            )}
          </button>
        )}
      </div>
    </div>
  </header>
);

const Sidebar = ({ activeSection, setActiveSection, menuOpen, setMenuOpen, user }) => {
  const NavButton = React.memo(({ icon: Icon, label, section }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
        activeSection === section ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  ));

  return (
    <aside className={`${menuOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-20 left-0 w-64 bg-slate-900 lg:bg-transparent p-4 lg:p-0 space-y-2 h-fit z-40 rounded-r-xl lg:rounded-none`}>
      <NavButton icon={Info} label="Inicio" section="info" />
      <NavButton icon={BookOpen} label="Tutoriales" section="tutoriales" />
      <NavButton icon={Camera} label="Portafolio" section="portafolio" />
      <NavButton icon={Wrench} label="Herramientas" section="herramientas" />
      <NavButton icon={Calendar} label="Agenda" section="agenda" />
      <NavButton icon={MessageCircle} label="Comunidad" section="comunidad" />
      {user?.role === 'admin' && <NavButton icon={DollarSign} label="Dashboard" section="dashboard" />}
    </aside>
  );
};

export default function BarberiaSimple() {
  const [activeSection, setActiveSection] = useState('info');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Sistema de autenticación
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('user'); // 'admin' o 'user'

  // Credenciales de ejemplo (en producción usar backend)
  const adminCredentials = { email: 'admin@barberia.com', password: 'admin123' };
  const userCredentials = { email: 'usuario@cliente.com', password: 'user123' };

  const login = () => {
    const credentials = loginRole === 'admin' ? adminCredentials : userCredentials;

    if (loginEmail === credentials.email && loginPassword === credentials.password) {
      const userData = {
        email: loginEmail,
        role: loginRole,
        name: loginRole === 'admin' ? 'Administrador' : 'Usuario'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      alert(`¡Bienvenido ${userData.name}!`);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveSection('info');
  };

  // Funciones para colaboradores
  const saveColaborador = () => {
    // Validaciones mejoradas
    if (!colaboradorName.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (colaboradorName.trim().length < 2) {
      alert('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (!colaboradorEmail.trim()) {
      alert('El email es obligatorio');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(colaboradorEmail.trim())) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Verificar email único (excepto para el colaborador que se está editando)
    const emailExists = colaboradores.some(col =>
      col.email.toLowerCase() === colaboradorEmail.trim().toLowerCase() &&
      (!editingColaborador || col.id !== editingColaborador.id)
    );

    if (emailExists) {
      alert('Ya existe un colaborador con este email');
      return;
    }

    // Validar teléfono si se proporciona
    if (colaboradorPhone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
      if (!phoneRegex.test(colaboradorPhone.trim())) {
        alert('Por favor ingresa un teléfono válido');
        return;
      }
    }

    if (editingColaborador) {
      // Editar colaborador existente
      setColaboradores(prev => prev.map(col =>
        col.id === editingColaborador.id
          ? { ...col, name: colaboradorName.trim(), email: colaboradorEmail.trim(), phone: colaboradorPhone.trim(), role: colaboradorRole }
          : col
      ));
    } else {
      // Agregar nuevo colaborador
      const newColaborador = {
        id: Date.now(),
        name: colaboradorName.trim(),
        email: colaboradorEmail.trim(),
        phone: colaboradorPhone.trim(),
        role: colaboradorRole,
        createdAt: new Date().toISOString()
      };
      setColaboradores(prev => [...prev, newColaborador]);
    }

    // Limpiar formulario
    setColaboradorName('');
    setColaboradorEmail('');
    setColaboradorPhone('');
    setColaboradorRole('barbero');
    setEditingColaborador(null);
    setShowColaboradorModal(false);
    alert(editingColaborador ? 'Colaborador actualizado exitosamente' : 'Colaborador agregado exitosamente');
  };

  const editColaborador = (colaborador) => {
    setEditingColaborador(colaborador);
    setColaboradorName(colaborador.name);
    setColaboradorEmail(colaborador.email);
    setColaboradorPhone(colaborador.phone || '');
    setColaboradorRole(colaborador.role);
    setShowColaboradorModal(true);
  };

  const deleteColaborador = (id) => {
    if (confirm('¿Estás seguro de eliminar este colaborador?')) {
      setColaboradores(prev => prev.filter(col => col.id !== id));
    }
  };
  
  // Función helper para cargar datos de localStorage de forma segura
  const loadFromStorage = (key, defaultValue, validator) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;

      const parsed = JSON.parse(saved);

      // Validar datos si se proporciona un validador
      if (validator && !validator(parsed)) {
        console.warn(`Invalid data for ${key}, using default`);
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Validadores para datos
  const isValidConfig = (data) => data && typeof data === 'object' && typeof data.businessName === 'string';
  const isValidArray = (data) => Array.isArray(data);
  const isValidAppointments = (data) => isValidArray(data) && data.every(item =>
    item && typeof item === 'object' && item.id && item.date && item.time && item.cliente && item.servicio
  );
  const isValidReviews = (data) => isValidArray(data) && data.every(item =>
    item && typeof item === 'object' && item.id && typeof item.rating === 'number' && item.name
  );

  // Configuración
  const [config, setConfig] = useState(() =>
    loadFromStorage('barberConfig', { businessName: 'Mi Barbería', barberName: '', phone: '', address: '' }, isValidConfig)
  );

  // Portfolio
  const [portfolio, setPortfolio] = useState(() =>
    loadFromStorage('portfolio', [], isValidArray)
  );

  // Reseñas
  const [reviews, setReviews] = useState(() =>
    loadFromStorage('reviews', [], isValidReviews)
  );

  // Citas
  const [appointments, setAppointments] = useState(() =>
    loadFromStorage('appointments', [], isValidAppointments)
  );

  // Servicios
  const [services] = useState([
    { id: 'fade', nombre: 'Fade Clásico', precio: '$12.000', duracion: '30 min', paymentLink: 'https://link.mercadopago.com.ar/megsargentina' },
    { id: 'pompadour', nombre: 'Pompadour', precio: '$15.000', duracion: '45 min', paymentLink: 'https://link.mercadopago.com.ar/megsargentina' },
    { id: 'buzz', nombre: 'Buzz Cut', precio: '$8.000', duracion: '15 min', paymentLink: 'https://link.mercadopago.com.ar/megsargentina' },
    { id: 'barba', nombre: 'Corte + Barba', precio: '$18.000', duracion: '50 min', paymentLink: 'https://link.mercadopago.com.ar/megsargentina' }
  ]);

  // Colaboradores
  const [colaboradores, setColaboradores] = useState(() => {
    const saved = localStorage.getItem('colaboradores');
    return saved ? JSON.parse(saved) : [];
  });

  // Estados para formulario de colaboradores
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [colaboradorName, setColaboradorName] = useState('');
  const [colaboradorEmail, setColaboradorEmail] = useState('');
  const [colaboradorPhone, setColaboradorPhone] = useState('');
  const [colaboradorRole, setColaboradorRole] = useState('barbero');

  // Estados formularios
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Estados para feedback visual
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Estados para notificaciones push
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      appointmentReminders: true,
      reviewNotifications: false,
      dailySummary: false
    };
  });
  const [detailType, setDetailType] = useState('');
  
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  
  const [portfolioImage, setPortfolioImage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const [wallComment, setWallComment] = useState('');
  const [wallComments, setWallComments] = useState(() =>
    loadFromStorage('wallComments', [], isValidArray)
  );

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const tutoriales = [
    {
      id: 1,
      nombre: 'Fade Clásico',
      dificultad: 'Intermedio',
      tiempo: '30-45 min',
      descripcion: 'Degradado suave desde arriba hacia los lados',
      pasos: ['Lava y seca el cabello', 'Define línea de fade', 'Máquina guarda #3 arriba', 'Guarda #2 zona media', 'Guarda #1 abajo', 'Difumina transiciones'],
      consejo: 'Trabaja en capas de arriba hacia abajo.'
    },
    {
      id: 2,
      nombre: 'Pompadour',
      dificultad: 'Avanzado',
      tiempo: '45-60 min',
      descripcion: 'Estilo vintage con volumen arriba',
      pasos: ['Separa sección superior', 'Corta lados con fade', 'Deja 8-12 cm arriba', 'Texturiza puntas', 'Crea capas', 'Finaliza con secador'],
      consejo: 'Requiere suficiente largo arriba.'
    },
    {
      id: 3,
      nombre: 'Buzz Cut',
      dificultad: 'Principiante',
      tiempo: '10-15 min',
      descripcion: 'Corte al ras uniforme',
      pasos: ['Selecciona guarda', 'Desde frente hacia atrás', 'Contra el crecimiento', 'Repite lados', 'Verifica uniformidad', 'Define contornos'],
      consejo: 'Mantén máquina plana.'
    },
    {
      id: 4,
      nombre: 'Undercut',
      dificultad: 'Intermedio',
      tiempo: '35-50 min',
      descripcion: 'Contraste marcado arriba/lados',
      pasos: ['Separa pelo superior', 'Rapa lados guarda #1', 'Marca línea separación', 'Corta parte superior', 'Texturiza', 'Define con navaja'],
      consejo: 'La línea debe estar bien definida.'
    },
    {
      id: 5,
      nombre: 'Mullet Moderno',
      dificultad: 'Avanzado',
      tiempo: '50-70 min',
      descripcion: 'Corto adelante, largo atrás',
      pasos: ['Divide en secciones', 'Corta frente y costados', 'Deja largo la nuca', 'Crea capas', 'Conecta zonas', 'Finaliza con navaja'],
      consejo: 'Equilibra el largo sin desproporción.'
    }
  ];

  useEffect(() => {
    try {
      localStorage.setItem('barberConfig', JSON.stringify(config));
    } catch (error) {
      console.warn('Error saving config to localStorage:', error);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    } catch (error) {
      console.warn('Error saving portfolio to localStorage:', error);
    }
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem('reviews', JSON.stringify(reviews));
    } catch (error) {
      console.warn('Error saving reviews to localStorage:', error);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (error) {
      console.warn('Error saving appointments to localStorage:', error);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('wallComments', JSON.stringify(wallComments));
    } catch (error) {
      console.warn('Error saving wallComments to localStorage:', error);
    }
  }, [wallComments]);

  useEffect(() => {
    try {
      localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    } catch (error) {
      console.warn('Error saving colaboradores to localStorage:', error);
    }
  }, [colaboradores]);

  // Efecto para guardar configuración de notificaciones
  useEffect(() => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    } catch (error) {
      console.warn('Error saving notification settings:', error);
    }
  }, [notificationSettings]);

  // Efecto para verificar permisos de notificación
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const isTimeBooked = (date, time) => {
    return appointments.some(apt => apt.date === date && apt.time === time);
  };

  const bookAppointment = useMemo(() => async () => {
    setIsLoading(true);
    setLoadingMessage('Validando datos...');

    try {
      // Validaciones mejoradas
      if (!clientName.trim()) {
        alert('El nombre del cliente es obligatorio');
        return;
      }

      if (clientName.trim().length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
      }

      if (!appointmentDate) {
        alert('Selecciona una fecha para la cita');
        return;
      }

      const selectedDate = new Date(appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert('No puedes agendar citas en fechas pasadas');
        return;
      }

      if (!appointmentTime) {
        alert('Selecciona un horario para la cita');
        return;
      }

      if (!selectedService) {
        alert('Selecciona un servicio');
        return;
      }

      const service = services.find(s => s.id === selectedService);
      if (!service) {
        alert('Servicio no válido');
        return;
      }

      setLoadingMessage('Verificando disponibilidad...');

      // Verificar si el horario ya está ocupado
      if (isTimeBooked(appointmentDate, appointmentTime)) {
        alert('Este horario ya está ocupado. Por favor selecciona otro.');
        return;
      }

      setLoadingMessage('Agendando cita...');

      const newApt = {
        id: Date.now(),
        date: appointmentDate,
        time: appointmentTime,
        cliente: clientName.trim(),
        servicio: service.nombre,
        precio: service.precio
      };

      setAppointments(prev => [...prev, newApt]);

      // Notificación push si está habilitada
      if (notificationSettings.appointmentReminders && notificationPermission === 'granted') {
        const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
        const now = new Date();
        const timeDiff = appointmentDateTime.getTime() - now.getTime();

        // Si la cita es en las próximas 24 horas, mostrar notificación
        if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
          new Notification('📅 Recordatorio de cita', {
            body: `Tienes una cita mañana a las ${appointmentTime} con ${clientName.trim()}`,
            icon: '/favicon-32x32.png',
            badge: '/favicon-16x16.png'
          });
        }
      }

      setLoadingMessage('Enviando confirmación...');

      const fecha = new Date(appointmentDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      const mensaje = `¡Hola! Confirmo mi cita:\n\n👤 ${clientName.trim()}\n✂️ ${service.nombre}\n💰 ${service.precio}\n📅 ${fecha}\n⏰ ${appointmentTime}`;

      if (config.phone) {
        window.open(`https://wa.me/${config.phone.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`, '_blank');
      }

      setClientName('');
      setSelectedService('');
      setAppointmentDate('');
      setAppointmentTime('');
      alert('¡Cita agendada exitosamente!');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [clientName, appointmentDate, appointmentTime, selectedService, services, config.phone, notificationSettings, notificationPermission]);

  const submitReview = async () => {
    setIsLoading(true);
    setLoadingMessage('Publicando reseña...');

    try {
      // Validaciones mejoradas
      if (!reviewName.trim()) {
        alert('El nombre es obligatorio');
        return;
      }

      if (reviewName.trim().length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
      }

      if (reviewRating === 0) {
        alert('Por favor selecciona una calificación');
        return;
      }

      if (reviewRating < 1 || reviewRating > 5) {
        alert('La calificación debe estar entre 1 y 5 estrellas');
        return;
      }

      // Validar comentario si se proporciona
      if (reviewComment.trim() && reviewComment.trim().length < 10) {
        alert('Si escribes un comentario, debe tener al menos 10 caracteres');
        return;
      }

      const newReview = {
        id: Date.now(),
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        image: reviewImage,
        date: new Date().toISOString().split('T')[0]
      };

      setReviews([newReview, ...reviews]);

      // Notificación push si está habilitada
      if (notificationSettings.reviewNotifications && notificationPermission === 'granted') {
        new Notification('⭐ Nueva reseña', {
          body: `${reviewName.trim()} dejó una reseña de ${reviewRating} estrellas`,
          icon: '/favicon-32x32.png',
          badge: '/favicon-16x16.png'
        });
      }

      setShowReviewModal(false);
      setReviewName('');
      setReviewComment('');
      setReviewRating(0);
      setReviewImage(null);
      alert('¡Reseña publicada exitosamente!');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.onerror = () => alert('Error al cargar la imagen');
    reader.readAsDataURL(file);
  };

  const addPortfolio = () => {
    if (!portfolioImage) {
      alert('Por favor selecciona una imagen primero');
      return;
    }

    setPortfolio([...portfolio, { id: Date.now(), image: portfolioImage, date: new Date().toISOString().split('T')[0] }]);
    setPortfolioImage(null);
    setShowPortfolioModal(false);
    alert('¡Foto agregada exitosamente!');
  };

  const postWallComment = useMemo(() => () => {
    if (!wallComment.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    if (wallComment.trim().length < 5) {
      alert('El comentario debe tener al menos 5 caracteres');
      return;
    }

    if (wallComment.trim().length > 500) {
      alert('El comentario no puede tener más de 500 caracteres');
      return;
    }

    const newComment = {
      id: Date.now(),
      text: wallComment.trim(),
      date: new Date().toISOString(),
      author: user ? user.name : 'Usuario Anónimo'
    };

    setWallComments(prev => [newComment, ...prev]);
    setWallComment('');

    // Notificación push si está habilitada
    if (notificationSettings.reviewNotifications && notificationPermission === 'granted') {
      new Notification('💬 Nuevo comentario', {
        body: `Comentario publicado en la comunidad`,
        icon: '/favicon-32x32.png',
        badge: '/favicon-16x16.png'
      });
    }

    alert('Comentario publicado exitosamente');
  }, [wallComment, user, notificationSettings, notificationPermission]);

  const stats = useMemo(() => {
    const total = appointments.reduce((sum, apt) => {
      const price = parseInt(apt.precio.replace(/\D/g, ''));
      return sum + price;
    }, 0);

    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

    return { totalEarnings: total, appointmentCount: appointments.length, avgRating };
  }, [appointments, reviews]);

  const StarRating = React.memo(({ rating, onRate, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`${readonly ? '' : 'hover:scale-110'} transition-transform`}
        >
          <Star size={28} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />
        </button>
      ))}
    </div>
  ));

  const NavButton = React.memo(({ icon: Icon, label, section }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
        activeSection === section ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  ));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header
        config={config}
        setShowConfigModal={setShowConfigModal}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        logout={logout}
        setShowLoginModal={setShowLoginModal}
        notificationPermission={notificationPermission}
        setShowNotificationSettings={setShowNotificationSettings}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

        <main className="flex-1">
          {activeSection === 'info' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <h2 className="text-4xl font-bold mb-4">💈 Barberia Simple</h2>
                <p className="text-slate-300 text-lg">Aplicación sencilla para gestionar tu barbería.</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-2xl font-bold mb-4">🎯 ¿Para quién es?</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">Independientes</h4>
                    <p className="text-sm text-slate-400">Gestiona tu agenda desde el móvil</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">En Formación</h4>
                    <p className="text-sm text-slate-400">Aprende técnicas profesionales</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">Dueños</h4>
                    <p className="text-sm text-slate-400">Organiza tu barbería</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">🚀 Primeros Pasos</h3>
                <ol className="space-y-2 text-slate-300">
                  <li>1. Configura tu barbería (botón ⚙️)</li>
                  <li>2. Sube fotos en Portafolio</li>
                  <li>3. Gestiona citas en Agenda</li>
                  <li>4. Recibe reseñas de clientes</li>
                  <li>5. Acepta pagos anticipados 💳</li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'tutoriales' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">📚 Tutoriales</h2>
              
              {tutoriales.map((t) => (
                <div key={t.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{t.nombre}</h3>
                      <p className="text-slate-400 mb-3">{t.descripcion}</p>
                      <div className="flex gap-3">
                        <span className={`px-3 py-1 rounded-lg text-sm border ${
                          t.dificultad === 'Principiante' ? 'bg-green-600/20 text-green-300 border-green-600/30' :
                          t.dificultad === 'Intermedio' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30' :
                          'bg-red-600/20 text-red-300 border-red-600/30'
                        }`}>{t.dificultad}</span>
                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm">{t.tiempo}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTutorial(selectedTutorial === t.id ? null : t.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      {selectedTutorial === t.id ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>

                  {selectedTutorial === t.id && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-bold text-blue-400 mb-3">Pasos:</h4>
                        <ol className="space-y-2">
                          {t.pasos.map((paso, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">{idx + 1}</span>
                              <span className="text-slate-300">{paso}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                        <strong>💡 Consejo:</strong> {t.consejo}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === 'herramientas' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">🛠️ Herramientas</h2>
              
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">Inversión Inicial</h3>
                <p className="text-4xl font-bold text-blue-400">$400.000 - $530.000</p>
                <p className="text-slate-400 mt-2">Argentina - Octubre 2025</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-blue-600/30">
                  <div className="flex gap-4">
                    <div className="text-4xl">🔵</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Wahl Magic Clip</h3>
                      <p className="text-slate-400 text-sm mb-2">Motor 6500 RPM, batería 90 min</p>
                      <p className="text-blue-400 font-bold text-lg">$300.000 - $360.000</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <div className="flex gap-4">
                    <div className="text-4xl">✂️</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Tijeras Profesionales</h3>
                      <p className="text-slate-400 text-sm mb-2">Acero japonés</p>
                      <p className="text-blue-400 font-bold text-lg">$40.000 - $60.000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-xl font-bold mb-4">🛒 Dónde Comprar</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <ChevronRight className="text-blue-400 mt-1" size={20} />
                    <div>
                      <p className="font-bold">Wahl Argentina (Oficial)</p>
                      <p className="text-sm text-slate-400">wahlargentina.com</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ChevronRight className="text-blue-400 mt-1" size={20} />
                    <div>
                      <p className="font-bold">MercadoLibre</p>
                      <p className="text-sm text-slate-400">Busca MercadoLíder Platinum</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'portafolio' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">📸 Portafolio</h2>
                <button onClick={() => setShowPortfolioModal(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                  <Camera size={20} />
                  Agregar
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-16 bg-slate-900 rounded-xl border-2 border-dashed border-slate-800">
                  <Camera className="mx-auto mb-4 text-slate-700" size={64} />
                  <p className="text-slate-400">No hay fotos. Agrega tus mejores trabajos</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <div key={item.id} className="relative">
                      <img src={item.image} alt="Trabajo" className="w-full h-64 object-cover rounded-xl" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'agenda' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">📅 Agenda</h2>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-xl font-bold mb-4">Servicios</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-bold">{s.nombre}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <span className="text-green-400 font-bold">{s.precio}</span>
                          <span className="text-sm text-slate-500 ml-2">{s.duracion}</span>
                        </div>
                        <button
                          onClick={() => window.open(s.paymentLink, '_blank')}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-1"
                        >
                          <CreditCard size={14} />
                          Pagar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-xl font-bold mb-4">Nueva Cita</h3>
                {isLoading && (
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                      <span className="text-blue-400">{loadingMessage}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />

                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="">Selecciona servicio...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre} - {s.precio}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setAppointmentTime('');
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />

                  {appointmentDate && (
                    <div>
                      <label className="block text-sm font-medium mb-3">Horarios</label>
                      <div className="grid grid-cols-5 gap-2">
                        {timeSlots.map((time) => {
                          const booked = isTimeBooked(appointmentDate, time);
                          const selected = appointmentTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => !booked && setAppointmentTime(time)}
                              disabled={booked}
                              className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                                booked ? 'bg-red-600/10 text-red-400 border-red-600/30 cursor-not-allowed' :
                                selected ? 'bg-blue-600 text-white border-blue-500' :
                                'bg-slate-800 border-slate-700 hover:border-blue-500'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {isLoading && (
                      <div className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {loadingMessage}
                      </div>
                    )}
                    <button
                      onClick={bookAppointment}
                      disabled={!clientName || !selectedService || !appointmentDate || !appointmentTime || isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} />
                      {isLoading ? 'Procesando...' : 'Confirmar por WhatsApp'}
                    </button>

                    {selectedService && (
                      <button
                        onClick={() => {
                          const service = services.find(s => s.id === selectedService);
                          if (service) window.open(service.paymentLink, '_blank');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        <CreditCard size={20} />
                        Pagar Anticipado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'comunidad' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">💬 Comunidad</h2>
                <div className="flex gap-3">
                  {user && (
                    <button onClick={() => setShowReviewModal(true)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2">
                      <Star size={16} />
                      Reseña
                    </button>
                  )}
                  <button onClick={() => document.getElementById('wall-input')?.focus()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                    <MessageCircle size={16} />
                    Comentar
                  </button>
                </div>
              </div>

              {/* Estadísticas de reseñas */}
              {reviews.length > 0 && (
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-yellow-400">{stats.avgRating}</div>
                      <p className="text-slate-400 mt-2">{reviews.length} reseñas</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percent = (count / reviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-2">
                            <span className="text-sm w-12">{star} ⭐</span>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-sm w-12">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario para publicar */}
              {user ? (
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-xl font-bold mb-4">Comparte tu opinión</h3>
                  <textarea
                    id="wall-input"
                    value={wallComment}
                    onChange={(e) => setWallComment(e.target.value)}
                    placeholder="Comparte tu experiencia, pregunta o comentario sobre nuestros servicios..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none mb-3"
                  />
                  <button
                    onClick={postWallComment}
                    disabled={!wallComment.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-lg"
                  >
                    Publicar en Comunidad
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
                  <User size={48} className="mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-bold mb-2">Inicia sesión para participar</h3>
                  <p className="text-slate-400 mb-4">Comparte reseñas, comentarios y conecta con la comunidad</p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}

              {/* Feed combinado ordenado por fecha */}
              <div className="space-y-4">
                {[...reviews.map(review => ({ ...review, type: 'review' })),
                  ...wallComments.map(comment => ({ ...comment, type: 'comment' }))]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((item) => {
                    if (item.type === 'review') {
                      const review = item;
                      return (
                        <div key={`review-${review.id}`} className="bg-gradient-to-r from-yellow-600/10 to-yellow-600/5 rounded-xl border border-yellow-600/30 overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                                  ⭐
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg">{review.name}</h4>
                                  <p className="text-sm text-yellow-400">Reseña</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRating rating={review.rating} readonly />
                                <button
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setShowShareModal(true);
                                  }}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                >
                                  <Share2 size={18} />
                                </button>
                              </div>
                            </div>
                            {review.image && (
                              <img src={review.image} alt="Corte" className="w-full h-48 object-cover rounded-lg mb-3" />
                            )}
                            {review.comment && <p className="text-slate-300 mb-3">"{review.comment}"</p>}
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm text-slate-500">
                                {new Date(review.date).toLocaleDateString('es-ES')}
                              </p>
                              <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                                  <Heart size={16} />
                                  <span className="text-sm">0</span>
                                </button>
                                <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                  <ThumbsUp size={16} />
                                  <span className="text-sm">0</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      const comment = item;
                      return (
                        <div key={`comment-${comment.id}`} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              👤
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold">{comment.author}</p>
                                <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Comentario</span>
                              </div>
                              <p className="text-slate-300 mt-2">{comment.text}</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-sm text-slate-500">
                                  {new Date(comment.date).toLocaleString('es-ES')}
                                </p>
                                <div className="flex items-center gap-2">
                                  <button className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                                    <Heart size={16} />
                                    <span className="text-sm">0</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                    <ThumbsUp size={16} />
                                    <span className="text-sm">0</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>

              {/* Estado vacío */}
              {reviews.length === 0 && wallComments.length === 0 && (
                <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
                  <MessageCircle className="mx-auto mb-4 text-slate-700" size={64} />
                  <p className="text-slate-400">La comunidad está esperando tus opiniones. ¡Sé el primero!</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'dashboard' && user?.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">📊 Dashboard Administrativo</h2>
                <button onClick={() => setShowColaboradorModal(true)} className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
                  <User size={20} />
                  Agregar Colaborador
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <DollarSign className="text-green-400 mb-3" size={32} />
                  <h3 className="font-bold mb-2">Ingresos</h3>
                  <p className="text-4xl font-bold text-green-400">${stats.totalEarnings.toLocaleString('es-AR')}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setDetailType('ingresos');
                        setShowDetailModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => {
                        const data = appointments.map(apt => `${apt.date},${apt.cliente},${apt.servicio},${apt.precio}`).join('\n');
                        const csv = 'Fecha,Cliente,Servicio,Precio\n' + data;
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ingresos.csv';
                        a.click();
                        window.URL.revokeObjectURL(url);
                        alert('Archivo CSV descargado exitosamente');
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-1"
                      title="Exportar a CSV"
                    >
                      📊
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <Calendar className="text-blue-400 mb-3" size={32} />
                  <h3 className="font-bold mb-2">Citas</h3>
                  <p className="text-4xl font-bold text-blue-400">{stats.appointmentCount}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setDetailType('citas');
                        setShowDetailModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => {
                        const data = appointments.map(apt => `${apt.date},${apt.time},${apt.cliente},${apt.servicio}`).join('\n');
                        const csv = 'Fecha,Hora,Cliente,Servicio\n' + data;
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'citas.csv';
                        a.click();
                        window.URL.revokeObjectURL(url);
                        alert('Archivo CSV descargado exitosamente');
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-1"
                      title="Exportar a CSV"
                    >
                      📊
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <Star className="text-yellow-400 mb-3" size={32} />
                  <h3 className="font-bold mb-2">Calificación</h3>
                  <p className="text-4xl font-bold text-yellow-400">{stats.avgRating}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setDetailType('calificacion');
                        setShowDetailModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => {
                        const data = reviews.map(review => `${review.date},${review.name},${review.rating},"${review.comment}"`).join('\n');
                        const csv = 'Fecha,Nombre,Calificación,Comentario\n' + data;
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'reseñas.csv';
                        a.click();
                        window.URL.revokeObjectURL(url);
                        alert('Archivo CSV descargado exitosamente');
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-1"
                      title="Exportar a CSV"
                    >
                      📊
                    </button>
                  </div>
                </div>
              </div>

              {/* Gestión de Colaboradores */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-xl font-bold mb-4">👥 Colaboradores</h3>
                {colaboradores.length === 0 ? (
                  <div className="text-center py-8">
                    <User size={48} className="mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">No hay colaboradores registrados</p>
                    <p className="text-sm text-slate-500 mt-2">Agrega colaboradores para gestionar tu equipo</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {colaboradores.map((colaborador) => (
                      <div key={colaborador.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            {colaborador.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{colaborador.name}</p>
                            <p className="text-sm text-slate-400">{colaborador.email}</p>
                            <p className="text-xs text-slate-500">{colaborador.phone || 'Sin teléfono'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            colaborador.role === 'barbero' ? 'bg-green-600' :
                            colaborador.role === 'asistente' ? 'bg-blue-600' : 'bg-purple-600'
                          }`}>
                            {colaborador.role}
                          </span>
                          <button
                            onClick={() => editColaborador(colaborador)}
                            className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                            title="Editar"
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            onClick={() => deleteColaborador(colaborador.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                            title="Eliminar"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modales */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">⚙️ Configuración</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig({...config, businessName: e.target.value})}
                placeholder="Nombre del negocio"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                value={config.phone}
                onChange={(e) => setConfig({...config, phone: e.target.value})}
                placeholder="WhatsApp (541112345678)"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({...config, address: e.target.value})}
                placeholder="Dirección"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowConfigModal(false)} className="flex-1 px-6 py-3 bg-slate-800 rounded-lg">Cancelar</button>
                <button onClick={() => setShowConfigModal(false)} className="flex-1 px-6 py-3 bg-blue-600 rounded-lg">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">Agregar Foto</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setPortfolioImage)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />
            {portfolioImage && <img src={portfolioImage} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />}
            <div className="flex gap-3">
              <button onClick={() => { setShowPortfolioModal(false); setPortfolioImage(null); }} className="flex-1 px-6 py-3 bg-slate-800 rounded-lg">Cancelar</button>
              <button onClick={addPortfolio} disabled={!portfolioImage} className="flex-1 px-6 py-3 bg-blue-600 disabled:bg-slate-700 rounded-lg">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-800 my-8">
            <h3 className="text-2xl font-bold mb-6">Dejar Reseña</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-3">Calificación</label>
                <StarRating rating={reviewRating} onRate={setReviewRating} />
              </div>
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tu comentario..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setReviewImage)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
              />
              {reviewImage && (
                <div className="relative">
                  <img src={reviewImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button onClick={() => setReviewImage(null)} className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded-lg text-sm">Eliminar</button>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setShowReviewModal(false); setReviewImage(null); }} className="flex-1 px-6 py-3 bg-slate-800 rounded-lg" disabled={isLoading}>Cancelar</button>
                <button onClick={submitReview} className="flex-1 px-6 py-3 bg-blue-600 rounded-lg" disabled={isLoading}>
                  {isLoading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && selectedReview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">Compartir</h3>
            <button
              onClick={() => {
                const stars = '⭐'.repeat(selectedReview.rating);
                const msg = `${stars}\n\n"${selectedReview.comment}"\n\n- ${selectedReview.name}\n\n💈 ${config.businessName}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                setShowShareModal(false);
              }}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-3 mb-3"
            >
              <MessageCircle size={24} />
              WhatsApp
            </button>
            <button onClick={() => setShowShareModal(false)} className="w-full px-6 py-3 bg-slate-800 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">Iniciar Sesión</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de usuario</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLoginRole('user')}
                    className={`flex-1 px-4 py-2 rounded-lg ${loginRole === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}
                  >
                    Usuario
                  </button>
                  <button
                    onClick={() => setLoginRole('admin')}
                    className={`flex-1 px-4 py-2 rounded-lg ${loginRole === 'admin' ? 'bg-red-600' : 'bg-slate-800'}`}
                  >
                    Administrador
                  </button>
                </div>
              </div>

              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Credenciales de prueba:</p>
                <p className="text-xs text-slate-500">
                  {loginRole === 'admin'
                    ? 'Admin: admin@barberia.com / admin123'
                    : 'Usuario: usuario@cliente.com / user123'
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowLoginModal(false); setLoginEmail(''); setLoginPassword(''); }} className="flex-1 px-6 py-3 bg-slate-800 rounded-lg">
                  Cancelar
                </button>
                <button onClick={login} className="flex-1 px-6 py-3 bg-blue-600 rounded-lg">
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showColaboradorModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">
              {editingColaborador ? 'Editar Colaborador' : 'Agregar Colaborador'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={colaboradorName}
                onChange={(e) => setColaboradorName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <input
                type="email"
                value={colaboradorEmail}
                onChange={(e) => setColaboradorEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <input
                type="tel"
                value={colaboradorPhone}
                onChange={(e) => setColaboradorPhone(e.target.value)}
                placeholder="Teléfono (opcional)"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Rol</label>
                <div className="grid grid-cols-3 gap-2">
                  {['barbero', 'asistente', 'recepcionista'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setColaboradorRole(role)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize ${
                        colaboradorRole === role ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowColaboradorModal(false);
                    setColaboradorName('');
                    setColaboradorEmail('');
                    setColaboradorPhone('');
                    setColaboradorRole('barbero');
                    setEditingColaborador(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button onClick={saveColaborador} className="flex-1 px-6 py-3 bg-blue-600 rounded-lg">
                  {editingColaborador ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotificationSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-800">
            <h3 className="text-2xl font-bold mb-6">🔔 Configuración de Notificaciones</h3>

            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Estado de permisos:</p>
                <p className={`font-medium ${
                  notificationPermission === 'granted' ? 'text-green-400' :
                  notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {notificationPermission === 'granted' ? '✅ Permitidas' :
                   notificationPermission === 'denied' ? '❌ Bloqueadas' : '⚠️ Pendiente'}
                </p>
              </div>

              {notificationPermission === 'default' && (
                <button
                  onClick={async () => {
                    if ('Notification' in window) {
                      const permission = await Notification.requestPermission();
                      setNotificationPermission(permission);
                      if (permission === 'granted') {
                        new Notification('¡Notificaciones activadas!', {
                          body: 'Ahora recibirás notificaciones de Barberia Simple',
                          icon: '/favicon-32x32.png'
                        });
                      }
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                  Solicitar Permiso
                </button>
              )}

              {notificationPermission === 'granted' && (
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.appointmentReminders}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        appointmentReminders: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Recordatorios de citas</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.reviewNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        reviewNotifications: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Nuevas reseñas y comentarios</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailySummary}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        dailySummary: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Resumen diario</span>
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowNotificationSettings(false)} className="flex-1 px-6 py-3 bg-slate-800 rounded-lg">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-slate-800 my-8">
            <h3 className="text-2xl font-bold mb-6">
              {detailType === 'ingresos' ? '💰 Detalle de Ingresos' :
               detailType === 'citas' ? '📅 Detalle de Citas' :
               '⭐ Detalle de Calificaciones'}
            </h3>
            
            {detailType === 'ingresos' && (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-slate-800 p-4 rounded-lg flex justify-between">
                    <div>
                      <p className="font-bold">{apt.cliente}</p>
                      <p className="text-sm text-slate-400">{apt.servicio}</p>
                      <p className="text-xs text-slate-500">{new Date(apt.date).toLocaleDateString('es-ES')} - {apt.time}</p>
                    </div>
                    <p className="text-green-400 font-bold">{apt.precio}</p>
                  </div>
                ))}
                {appointments.length === 0 && <p className="text-slate-400 text-center py-8">No hay citas registradas</p>}
              </div>
            )}

            {detailType === 'citas' && (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-slate-800 p-4 rounded-lg">
                    <p className="font-bold">{apt.cliente}</p>
                    <p className="text-sm text-slate-400">{apt.servicio} - {apt.precio}</p>
                    <p className="text-sm text-blue-400">{new Date(apt.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} - {apt.time}</p>
                  </div>
                ))}
                {appointments.length === 0 && <p className="text-slate-400 text-center py-8">No hay citas registradas</p>}
              </div>
            )}

            {detailType === 'calificacion' && (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">{review.name}</p>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{review.comment}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(review.date).toLocaleDateString('es-ES')}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-slate-400 text-center py-8">No hay reseñas registradas</p>}
              </div>
            )}

            <button onClick={() => setShowDetailModal(false)} className="w-full mt-6 px-6 py-3 bg-blue-600 rounded-lg">Cerrar</button>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="font-bold text-white">Barberia Simple</p>
          <p className="text-sm mt-1">Gestión sencilla 💈</p>
        </div>
      </footer>
    </div>
  );
}