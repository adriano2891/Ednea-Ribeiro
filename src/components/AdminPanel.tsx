import { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Calendar as CalendarIcon,
  List,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserX,
  Phone,
  MessageSquare,
  Search,
  Plus,
  Settings as SettingsIcon,
  Bell,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import type { Booking, Service, Settings, BlockedSlot } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingChanged?: () => void;
}

export default function AdminPanel({ isOpen, onClose, onBookingChanged }: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ednea_admin_token'));
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'overview' | 'calendar' | 'bookings' | 'manual_booking' | 'services' | 'schedule'
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'bookings' | 'manual_booking' | 'services' | 'schedule'>('overview');

  // Real-time alert for new booking
  const [newBookingAlert, setNewBookingAlert] = useState<Booking | null>(null);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter states for bookings list
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Calendar states
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Reschedule modal state
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Manual booking form state
  const [manServiceId, setManServiceId] = useState('');
  const [manClientName, setManClientName] = useState('');
  const [manClientPhone, setManClientPhone] = useState('');
  const [manLocationType, setManLocationType] = useState<'salon' | 'home'>('salon');
  const [manClientAddress, setManClientAddress] = useState('');
  const [manDate, setManDate] = useState(new Date().toISOString().split('T')[0]);
  const [manTime, setManTime] = useState('10:00');
  const [manNotes, setManNotes] = useState('');

  // Blocked slot form state
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockStart, setBlockStart] = useState('14:00');
  const [blockEnd, setBlockEnd] = useState('16:00');
  const [blockReason, setBlockReason] = useState('Compromisso Pessoal / Formação');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Código incorreto');
      }
      setToken(data.token);
      localStorage.setItem('ednea_admin_token', data.token);
      setPinInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Código de acesso incorreto.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ednea_admin_token');
  };

  // Fetch admin data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Overview
      const resOverview = await fetch('/api/admin/overview', { headers });
      if (resOverview.status === 401) {
        handleLogout();
        return;
      }
      const dataOverview = await resOverview.json();
      setOverview(dataOverview);

      // Bookings
      let url = '/api/admin/bookings?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (dateFilter) url += `date=${dateFilter}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const resBookings = await fetch(url, { headers });
      const dataBookings = await resBookings.json();
      setBookings(dataBookings.bookings || []);

      // Settings & Services
      const resSettings = await fetch('/api/admin/settings', { headers });
      const dataSettings = await resSettings.json();
      setSettings(dataSettings.settings);
      setServices(dataSettings.services || []);
      if (dataSettings.services && dataSettings.services.length > 0 && !manServiceId) {
        setManServiceId(dataSettings.services[0].id);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchData();
    }
  }, [isOpen, token, statusFilter, dateFilter, searchQuery]);

  // Real-time SSE listener
  useEffect(() => {
    if (!isOpen || !token) return;

    const eventSource = new EventSource('/api/events');

    eventSource.addEventListener('new_booking', (event: any) => {
      try {
        const newBooking: Booking = JSON.parse(event.data);
        setNewBookingAlert(newBooking);
        fetchData();
        if (onBookingChanged) onBookingChanged();
      } catch (err) {
        console.error('SSE parse error', err);
      }
    });

    eventSource.addEventListener('booking_updated', () => {
      fetchData();
      if (onBookingChanged) onBookingChanged();
    });

    eventSource.addEventListener('settings_updated', () => {
      fetchData();
    });

    return () => {
      eventSource.close();
    };
  }, [isOpen, token]);

  // Update Booking Status
  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setStatusMessage(`Estado alterado para ${newStatus}.`);
        setTimeout(() => setStatusMessage(null), 3000);
        fetchData();
        if (onBookingChanged) onBookingChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Reschedule
  const handleRescheduleSubmit = async () => {
    if (!reschedulingBooking || !rescheduleDate || !rescheduleTime) return;
    setRescheduleError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${reschedulingBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: rescheduleDate,
          time: rescheduleTime
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao reagendar.');
      }
      setReschedulingBooking(null);
      setStatusMessage('Agendamento reagendado com sucesso!');
      setTimeout(() => setStatusMessage(null), 3000);
      fetchData();
      if (onBookingChanged) onBookingChanged();
    } catch (err: any) {
      setRescheduleError(err.message || 'Erro ao reagendar.');
    }
  };

  // Manual booking creation
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manServiceId || !manClientName || !manClientPhone || !manDate || !manTime) return;

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: manServiceId,
          clientName: manClientName,
          clientPhone: manClientPhone,
          locationType: manLocationType,
          clientAddress: manLocationType === 'home' ? manClientAddress.trim() : '',
          date: manDate,
          time: manTime,
          notes: manNotes,
          status: 'confirmed'
        })
      });
      if (res.ok) {
        setStatusMessage('Agendamento manual criado com sucesso!');
        setTimeout(() => setStatusMessage(null), 3000);
        setManClientName('');
        setManClientPhone('');
        setManNotes('');
        setActiveTab('bookings');
        fetchData();
        if (onBookingChanged) onBookingChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings update
  const handleSaveSettings = async (updatedSettings: Partial<Settings>, updatedServices?: Service[]) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updatedSettings,
          services: updatedServices || services
        })
      });
      if (res.ok) {
        setStatusMessage('Configurações gravadas com sucesso!');
        setTimeout(() => setStatusMessage(null), 3000);
        fetchData();
        if (onBookingChanged) onBookingChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Blocked Slot
  const handleAddBlockedSlot = () => {
    if (!settings) return;
    const newBlock: BlockedSlot = {
      id: 'blk_' + Date.now(),
      date: blockDate,
      timeStart: blockStart,
      timeEnd: blockEnd,
      reason: blockReason
    };
    const updatedBlocked = [...settings.blockedSlots, newBlock];
    handleSaveSettings({ blockedSlots: updatedBlocked });
  };

  // Remove Blocked Slot
  const handleRemoveBlockedSlot = (id: string) => {
    if (!settings) return;
    const updatedBlocked = settings.blockedSlots.filter((b) => b.id !== id);
    handleSaveSettings({ blockedSlots: updatedBlocked });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div
        className="bg-[#FAF7F6] rounded-3xl max-w-5xl w-full h-[94vh] border border-[#EBD6DC] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EEDDE2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#DCA2B1] bg-[#FAF2F4] flex items-center justify-center text-[#8C334D] font-serif font-bold text-xs tracking-wider">
              ER
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#2B2527]">
                  Painel de Gestão · Ednea Ribeiro
                </h3>
                <span className="text-[11px] text-[#8C334D] font-medium bg-[#FAF2F4] px-2 py-0.5 rounded-full border border-[#E9CAD2]">
                  Europe/Lisbon
                </span>
              </div>
              <p className="text-[11px] text-[#7C6C71]">
                Rua de Costa Cabral, 416 · Porto · Contacto: 914 231 627
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <>
                <button
                  onClick={fetchData}
                  className="p-2 text-[#706167] hover:text-[#2B2527] hover:bg-[#FAF2F4] rounded-lg transition-colors"
                  title="Atualizar dados"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#706167] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Terminar Sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#706167] hover:text-[#2B2527] rounded-lg transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time New Booking Alert Banner */}
        {newBookingAlert && (
          <div className="px-6 py-3 bg-[#FAF2F4] border-b border-[#E2B7C3] flex items-center justify-between text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-[#8C334D] font-medium">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>
                <strong>Novo agendamento recebido!</strong> {newBookingAlert.clientName} ({newBookingAlert.serviceName} a {newBookingAlert.date} às {newBookingAlert.time}).
              </span>
            </div>
            <button
              onClick={() => {
                setNewBookingAlert(null);
                setActiveTab('bookings');
              }}
              className="px-3 py-1 bg-[#8C334D] text-white rounded-lg text-xs font-semibold hover:bg-[#77283E]"
            >
              Ver Pedidos
            </button>
          </div>
        )}

        {/* Status toast message */}
        {statusMessage && (
          <div className="px-6 py-2 bg-emerald-50 text-emerald-800 border-b border-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Not authenticated screen */}
        {!token ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF7F6]">
            <form
              onSubmit={handleLogin}
              className="bg-white p-8 rounded-3xl border border-[#EBD6DC] shadow-lg max-w-sm w-full space-y-5 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#FAF2F4] border border-[#DCA2B1] text-[#8C334D] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-[#2B2527]">
                  Acesso Reservado
                </h4>
                <p className="text-xs text-[#7B6E73] mt-1">
                  Introduza o código de segurança para aceder à gestão de marcações da Ednea Ribeiro.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {authError}
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#2B2527]">Código de Acesso</label>
                <input
                  type="password"
                  required
                  placeholder="Introduza o PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none text-center tracking-widest text-lg font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#8C334D] hover:bg-[#77283E] text-white text-sm font-semibold transition-all shadow-sm"
              >
                Entrar no Painel
              </button>

              <p className="text-[11px] text-[#A29197]">
                Código inicial de fábrica: <code className="font-mono font-bold text-[#8C334D]">ednea2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="px-6 py-2.5 bg-white border-b border-[#EEDDE2] flex items-center gap-2 overflow-x-auto text-xs font-semibold text-[#6E6065] shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <span>Resumo do Dia</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'bookings'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista de Agendamentos</span>
                {overview?.pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center ml-1">
                    {overview.pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendário Geral</span>
              </button>

              <button
                onClick={() => setActiveTab('manual_booking')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'manual_booking'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Agendamento</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'services'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Serviços & Preços</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'schedule'
                    ? 'bg-[#8C334D] text-white shadow-xs'
                    : 'hover:bg-[#FAF2F4] hover:text-[#2B2527]'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Horários & Bloqueios</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* 1. OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#EBD6DC] shadow-xs">
                      <span className="text-xs text-[#7B6E73] font-medium">Atendimentos Previstos Hoje</span>
                      <p className="text-3xl font-serif font-bold text-[#8C334D] mt-1">
                        {overview?.todayCount ?? 0}
                      </p>
                      <span className="text-[11px] text-[#A29197]">
                        {overview?.confirmedTodayCount ?? 0} confirmados
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#EBD6DC] shadow-xs">
                      <span className="text-xs text-[#7B6E73] font-medium">Pedidos a Aguardar Confirmação</span>
                      <p className="text-3xl font-serif font-bold text-amber-600 mt-1">
                        {overview?.pendingCount ?? 0}
                      </p>
                      <span className="text-[11px] text-amber-700">Necessitam da sua validação</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#EBD6DC] shadow-xs">
                      <span className="text-xs text-[#7B6E73] font-medium">Total de Agendamentos no Sistema</span>
                      <p className="text-3xl font-serif font-bold text-[#2B2527] mt-1">
                        {overview?.totalBookings ?? 0}
                      </p>
                      <span className="text-[11px] text-[#A29197]">Histórico total guardado</span>
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EBD6DC] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-semibold text-[#2B2527]">
                        Agenda de Hoje ({new Date().toLocaleDateString('pt-PT')})
                      </h4>
                      <button
                        onClick={() => {
                          setDateFilter(new Date().toISOString().split('T')[0]);
                          setActiveTab('bookings');
                        }}
                        className="text-xs text-[#8C334D] font-semibold hover:underline"
                      >
                        Ver todos de hoje →
                      </button>
                    </div>

                    {overview?.todayBookings?.length === 0 ? (
                      <p className="text-xs text-[#7B6E73] py-4 text-center">
                        Nenhum atendimento agendado para o dia de hoje.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {overview?.todayBookings?.map((b: Booking) => (
                          <div
                            key={b.id}
                            className="p-3.5 rounded-xl border border-[#F0DFE3] bg-[#FAF7F6] flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-base text-[#8C334D] font-mono">
                                {b.time}
                              </span>
                              <div>
                                <p className="font-bold text-[#2B2527]">{b.clientName}</p>
                                <p className="text-[#6D5D63]">{b.serviceName} (~{b.durationMinutes} min)</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={`https://wa.me/351${b.clientPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#1E7E34] hover:bg-[#25D366]/20 transition-colors"
                                title="Abrir WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                              <a
                                href={`tel:${b.clientPhone}`}
                                className="p-1.5 rounded-lg bg-[#FAF2F4] text-[#8C334D] hover:bg-[#F3E2E6] transition-colors"
                                title="Ligar"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                >
                                  Confirmar
                                </button>
                              )}
                              {b.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'completed')}
                                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                >
                                  Concluir
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. BOOKINGS LIST TAB */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EBD6DC] grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-[#9A8990]" />
                      <input
                        type="text"
                        placeholder="Pesquisar cliente, telemóvel, ref..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                      />
                    </div>

                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                      >
                        <option value="all">Todos os Estados</option>
                        <option value="pending">A aguardar confirmação</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="completed">Concluídos</option>
                        <option value="cancelled">Cancelados</option>
                        <option value="no_show">Não compareceu</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                      />
                    </div>
                  </div>

                  {/* Bookings Table / List */}
                  <div className="bg-white rounded-2xl border border-[#EBD6DC] overflow-hidden shadow-xs">
                    {bookings.length === 0 ? (
                      <div className="p-10 text-center text-xs text-[#7B6E73]">
                        Nenhum agendamento encontrado com os filtros atuais.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F0DFE3]">
                        {bookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F6]/50 transition-colors"
                          >
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#8C334D]">
                                  {b.reference}
                                </span>
                                <span className="text-[#CDBEC3]">·</span>
                                <span className="text-xs font-semibold text-[#2B2527]">
                                  {b.date} às {b.time}
                                </span>
                                <span className="text-[#CDBEC3]">·</span>
                                <span className="text-xs text-[#736369]">
                                  {b.serviceName} (~{b.durationMinutes} min)
                                </span>
                                <span className="text-[#CDBEC3]">·</span>
                                <span
                                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                    b.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'pending'
                                      ? 'bg-amber-100 text-amber-900'
                                      : b.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : b.status === 'no_show'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {b.status === 'confirmed'
                                    ? 'Confirmado'
                                    : b.status === 'pending'
                                    ? 'A aguardar confirmação'
                                    : b.status === 'completed'
                                    ? 'Concluído'
                                    : b.status === 'no_show'
                                    ? 'Não compareceu'
                                    : 'Cancelado'}
                                </span>
                                <span className="text-[#CDBEC3]">·</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                    b.locationType === 'home'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : 'bg-[#FAF2F4] text-[#8C334D]'
                                  }`}
                                >
                                  {b.locationType === 'home' ? 'Ao Domicílio' : 'No Gabinete'}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#52454B]">
                                <span className="font-medium text-[#2B2527]">{b.clientName}</span>
                                <span className="text-[#CDBEC3]">|</span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-[#8C334D]" />
                                  {b.clientPhone}
                                </span>
                                {b.locationType === 'home' && b.clientAddress && (
                                  <>
                                    <span className="text-[#CDBEC3]">|</span>
                                    <span className="font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                                      Morada: {b.clientAddress}
                                    </span>
                                  </>
                                )}
                                {b.notes && (
                                  <>
                                    <span className="text-[#CDBEC3]">|</span>
                                    <span className="italic text-[#83747A]">Obs: "{b.notes}"</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Direct WhatsApp contact */}
                              <a
                                href={`https://wa.me/351${b.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `Olá ${b.clientName}, aqui é da estética Ednea Ribeiro no Porto.\nRelativamente ao seu agendamento (${b.serviceName} para dia ${b.date} às ${b.time})...`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 text-[#1E7E34] hover:bg-[#25D366]/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>

                              {/* Confirm action */}
                              {b.status !== 'confirmed' && b.status !== 'completed' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Confirmar</span>
                                </button>
                              )}

                              {/* Complete action */}
                              {b.status !== 'completed' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'completed')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                                >
                                  <span>Concluir</span>
                                </button>
                              )}

                              {/* Reschedule trigger */}
                              <button
                                onClick={() => {
                                  setReschedulingBooking(b);
                                  setRescheduleDate(b.date);
                                  setRescheduleTime(b.time);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF2F4] text-[#8C334D] hover:bg-[#F3E2E6] text-xs font-semibold transition-colors"
                              >
                                <span>Reagendar</span>
                              </button>

                              {/* No-show action */}
                              {b.status !== 'no_show' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'no_show')}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition-colors"
                                  title="Marcar como Não Compareceu"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Cancel action */}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors"
                                  title="Cancelar agendamento"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. CALENDAR TAB */}
              {activeTab === 'calendar' && (
                <div className="bg-white rounded-2xl border border-[#EBD6DC] p-6 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const d = new Date(calendarDate);
                          d.setMonth(d.getMonth() - 1);
                          setCalendarDate(d);
                        }}
                        className="p-1.5 rounded-lg border border-[#EBD6DC] hover:bg-[#FAF7F6]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="text-base font-serif font-bold text-[#2B2527] capitalize">
                        {calendarDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                      </h4>
                      <button
                        onClick={() => {
                          const d = new Date(calendarDate);
                          d.setMonth(d.getMonth() + 1);
                          setCalendarDate(d);
                        }}
                        className="p-1.5 rounded-lg border border-[#EBD6DC] hover:bg-[#FAF7F6]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-[#8C334D] font-medium">
                      * Mostra todos os agendamentos ativos em tempo real
                    </div>
                  </div>

                  {/* Monthly Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#7B6E73] pt-2">
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div>Sáb</div>
                    <div>Dom</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 pt-1">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const dayNumber = (i % 31) + 1;
                      const currentMonthStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                      const dayBookings = bookings.filter((b) => b.date === currentMonthStr && b.status !== 'cancelled');

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setDateFilter(currentMonthStr);
                            setActiveTab('bookings');
                          }}
                          className={`min-h-[70px] p-1.5 rounded-xl border text-left cursor-pointer transition-colors flex flex-col justify-between ${
                            dayBookings.length > 0
                              ? 'bg-[#FAF2F4] border-[#DCA2B1] hover:border-[#8C334D]'
                              : 'bg-white border-[#F0DFE3] hover:bg-[#FAF7F6]'
                          }`}
                        >
                          <span className="text-xs font-semibold text-[#2B2527] block">
                            {dayNumber}
                          </span>
                          {dayBookings.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              <span className="text-[10px] font-bold text-[#8C334D] block truncate">
                                {dayBookings.length} {dayBookings.length === 1 ? 'reserva' : 'reservas'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. MANUAL BOOKING CREATION TAB */}
              {activeTab === 'manual_booking' && (
                <div className="bg-white rounded-2xl border border-[#EBD6DC] p-6 max-w-xl mx-auto shadow-xs space-y-5">
                  <div>
                    <h4 className="text-lg font-serif font-semibold text-[#2B2527]">
                      Novo Agendamento Manual
                    </h4>
                    <p className="text-xs text-[#7B6E73]">
                      Para clientes que agendem presencialmente ou por chamada telefónica.
                    </p>
                  </div>

                  <form onSubmit={handleCreateManualBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2527]">Serviço *</label>
                      <select
                        value={manServiceId}
                        onChange={(e) => setManServiceId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} (~{s.durationMinutes} min)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Nome da Cliente *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ana Rodrigues"
                          value={manClientName}
                          onChange={(e) => setManClientName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Telemóvel *</label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: 914 231 627"
                          value={manClientPhone}
                          onChange={(e) => setManClientPhone(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Modalidade *</label>
                        <select
                          value={manLocationType}
                          onChange={(e) => setManLocationType(e.target.value as 'salon' | 'home')}
                          className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                        >
                          <option value="salon">No Gabinete (Costa Cabral)</option>
                          <option value="home">Ao Domicílio (na morada do cliente)</option>
                        </select>
                      </div>

                      {manLocationType === 'home' && (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#2B2527]">Morada de Domicílio *</label>
                          <input
                            type="text"
                            required
                            placeholder="Rua, Número, Código Postal, Porto"
                            value={manClientAddress}
                            onChange={(e) => setManClientAddress(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Data *</label>
                        <input
                          type="date"
                          required
                          value={manDate}
                          onChange={(e) => setManDate(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Horário (HH:MM) *</label>
                        <input
                          type="text"
                          required
                          placeholder="10:00"
                          value={manTime}
                          onChange={(e) => setManTime(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2527]">Observações</label>
                      <textarea
                        rows={2}
                        placeholder="Notas adicionais sobre o atendimento..."
                        value={manNotes}
                        onChange={(e) => setManNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-[#FAF7F6] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#8C334D] hover:bg-[#77283E] text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      Gravar Agendamento Confirmado
                    </button>
                  </form>
                </div>
              )}

              {/* 5. SERVICES & PROMOTION MANAGEMENT TAB */}
              {activeTab === 'services' && settings && (
                <div className="space-y-6">
                  {/* Promotion 35 € Controller */}
                  <div className="p-6 rounded-2xl bg-[#FAF2F4] border border-[#E6BAC6] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#8C334D]" />
                        <h4 className="text-base font-serif font-bold text-[#2B2527]">
                          Campanha Promocional (35 €)
                        </h4>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2B2527]">
                        <input
                          type="checkbox"
                          checked={settings.promoInfo.enabled && settings.promoInfo.confirmedByProfessional}
                          onChange={(e) => {
                            const updated = {
                              ...settings.promoInfo,
                              enabled: e.target.checked,
                              confirmedByProfessional: e.target.checked
                            };
                            handleSaveSettings({ promoInfo: updated });
                          }}
                          className="w-4 h-4 rounded text-[#8C334D] focus:ring-[#8C334D]"
                        />
                        <span>Publicar promoção no site</span>
                      </label>
                    </div>

                    <p className="text-xs text-[#6F6066]">
                      * Conforme as diretrizes: a promoção só surge no site público se a profissional confirmar expressamente a sua validade e definir as suas condições.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Título da Campanha</label>
                        <input
                          type="text"
                          value={settings.promoInfo.title}
                          onChange={(e) => {
                            const updated = { ...settings.promoInfo, title: e.target.value };
                            setSettings({ ...settings, promoInfo: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B2527]">Preço (€)</label>
                        <input
                          type="number"
                          value={settings.promoInfo.price}
                          onChange={(e) => {
                            const updated = { ...settings.promoInfo, price: Number(e.target.value) };
                            setSettings({ ...settings, promoInfo: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B2527]">Condições da Campanha</label>
                      <input
                        type="text"
                        value={settings.promoInfo.conditions}
                        onChange={(e) => {
                          const updated = { ...settings.promoInfo, conditions: e.target.value };
                          setSettings({ ...settings, promoInfo: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs text-[#2B2527] bg-white outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSettings({ promoInfo: settings.promoInfo })}
                      className="px-4 py-2 rounded-xl bg-[#8C334D] text-white text-xs font-semibold hover:bg-[#77283E]"
                    >
                      Gravar Estado da Campanha
                    </button>
                  </div>

                  {/* Confirmed Services List & Editor */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EBD6DC] space-y-4 shadow-xs">
                    <h4 className="text-base font-serif font-bold text-[#2B2527]">
                      Serviços Confirmados de Ednea Ribeiro
                    </h4>

                    <div className="space-y-3">
                      {services.map((srv, idx) => (
                        <div
                          key={srv.id}
                          className="p-4 rounded-xl border border-[#F0DFE3] bg-[#FAF7F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#2B2527]">{srv.name}</span>
                              <span className="text-[#8C334D] font-medium">({srv.category})</span>
                            </div>
                            <p className="text-[#6D5D63] text-xs">{srv.description}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="space-y-0.5 text-right">
                              <span className="text-[#7C6C71] text-[11px] block">Duração (min)</span>
                              <input
                                type="number"
                                value={srv.durationMinutes}
                                onChange={(e) => {
                                  const updated = [...services];
                                  updated[idx].durationMinutes = Number(e.target.value);
                                  setServices(updated);
                                }}
                                className="w-16 px-2 py-1 rounded-lg border border-[#EBD6DC] bg-white text-center text-xs font-semibold"
                              />
                            </div>

                            <div className="space-y-0.5 text-right">
                              <span className="text-[#7C6C71] text-[11px] block">Preço (€)</span>
                              <input
                                type="number"
                                placeholder="Consulta"
                                value={srv.price ?? ''}
                                onChange={(e) => {
                                  const updated = [...services];
                                  updated[idx].price = e.target.value ? Number(e.target.value) : null;
                                  setServices(updated);
                                }}
                                className="w-20 px-2 py-1 rounded-lg border border-[#EBD6DC] bg-white text-center text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSettings({}, services)}
                      className="px-5 py-2.5 rounded-xl bg-[#8C334D] text-white text-xs font-semibold hover:bg-[#77283E]"
                    >
                      Gravar Alterações aos Serviços
                    </button>
                  </div>
                </div>
              )}

              {/* 6. SCHEDULE & BLOCKS TAB */}
              {activeTab === 'schedule' && settings && (
                <div className="space-y-6">
                  {/* Working Hours */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EBD6DC] space-y-4 shadow-xs">
                    <h4 className="text-base font-serif font-bold text-[#2B2527]">
                      Horário de Funcionamento Semanal (Portugal continental)
                    </h4>

                    <div className="space-y-2 text-xs">
                      {Object.entries(settings.workingHours).map(([dayKey, dayConfig]) => (
                        <div
                          key={dayKey}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F6] border border-[#F0DFE3]"
                        >
                          <div className="w-28 font-semibold capitalize text-[#2B2527]">
                            {dayKey === 'terca' ? 'terça' : dayKey === 'sabado' ? 'sábado' : dayKey}
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dayConfig.active}
                                onChange={(e) => {
                                  const updatedHours = {
                                    ...settings.workingHours,
                                    [dayKey]: { ...dayConfig, active: e.target.checked }
                                  };
                                  setSettings({ ...settings, workingHours: updatedHours });
                                }}
                                className="w-4 h-4 rounded text-[#8C334D]"
                              />
                              <span>Aberto</span>
                            </label>

                            {dayConfig.active && (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={dayConfig.open}
                                  onChange={(e) => {
                                    const updatedHours = {
                                      ...settings.workingHours,
                                      [dayKey]: { ...dayConfig, open: e.target.value }
                                    };
                                    setSettings({ ...settings, workingHours: updatedHours });
                                  }}
                                  className="w-16 px-2 py-1 rounded-md border border-[#EBD6DC] text-center font-mono text-xs bg-white"
                                />
                                <span>às</span>
                                <input
                                  type="text"
                                  value={dayConfig.close}
                                  onChange={(e) => {
                                    const updatedHours = {
                                      ...settings.workingHours,
                                      [dayKey]: { ...dayConfig, close: e.target.value }
                                    };
                                    setSettings({ ...settings, workingHours: updatedHours });
                                  }}
                                  className="w-16 px-2 py-1 rounded-md border border-[#EBD6DC] text-center font-mono text-xs bg-white"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSettings({ workingHours: settings.workingHours })}
                      className="px-5 py-2 rounded-xl bg-[#8C334D] text-white text-xs font-semibold hover:bg-[#77283E]"
                    >
                      Gravar Horários de Funcionamento
                    </button>
                  </div>

                  {/* Lunch break configuration */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EBD6DC] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#2B2527]">
                        Pausa para Almoço / Intervalo
                      </h4>
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={settings.lunchBreak?.enabled}
                          onChange={(e) => {
                            const updatedLunch = {
                              ...settings.lunchBreak,
                              enabled: e.target.checked
                            };
                            handleSaveSettings({ lunchBreak: updatedLunch });
                          }}
                          className="w-4 h-4 rounded text-[#8C334D]"
                        />
                        <span>Ativar intervalo</span>
                      </label>
                    </div>

                    {settings.lunchBreak?.enabled && (
                      <div className="flex items-center gap-2 text-xs">
                        <span>Das</span>
                        <input
                          type="text"
                          value={settings.lunchBreak.start}
                          onChange={(e) => {
                            const updatedLunch = { ...settings.lunchBreak, start: e.target.value };
                            setSettings({ ...settings, lunchBreak: updatedLunch });
                          }}
                          className="w-16 px-2 py-1 rounded-md border border-[#EBD6DC] text-center font-mono"
                        />
                        <span>às</span>
                        <input
                          type="text"
                          value={settings.lunchBreak.end}
                          onChange={(e) => {
                            const updatedLunch = { ...settings.lunchBreak, end: e.target.value };
                            setSettings({ ...settings, lunchBreak: updatedLunch });
                          }}
                          className="w-16 px-2 py-1 rounded-md border border-[#EBD6DC] text-center font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSettings({ lunchBreak: settings.lunchBreak })}
                          className="ml-2 px-3 py-1 bg-[#8C334D] text-white rounded-lg text-xs"
                        >
                          Gravar Almoço
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Blocked Slots & Vacation */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EBD6DC] space-y-4 shadow-xs">
                    <h4 className="text-base font-serif font-bold text-[#2B2527]">
                      Bloqueio de Horários / Folgas Pontuais
                    </h4>

                    {/* Add block form */}
                    <div className="p-4 rounded-xl bg-[#FAF7F6] border border-[#F0DFE3] space-y-3">
                      <span className="text-xs font-semibold text-[#2B2527] block">Adicionar Novo Bloqueio</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <input
                          type="date"
                          value={blockDate}
                          onChange={(e) => setBlockDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#EBD6DC] bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Início (14:00)"
                          value={blockStart}
                          onChange={(e) => setBlockStart(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#EBD6DC] bg-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Fim (16:00)"
                          value={blockEnd}
                          onChange={(e) => setBlockEnd(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#EBD6DC] bg-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Motivo"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#EBD6DC] bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBlockedSlot}
                        className="px-4 py-2 rounded-xl bg-[#8C334D] text-white text-xs font-semibold hover:bg-[#77283E]"
                      >
                        Bloquear Período
                      </button>
                    </div>

                    {/* Active Blocked Slots List */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#7B6E73] block">Períodos Atualmente Bloqueados:</span>
                      {settings.blockedSlots.length === 0 ? (
                        <p className="text-xs text-[#9E8E94]">Nenhum horário bloqueado.</p>
                      ) : (
                        settings.blockedSlots.map((blk) => (
                          <div
                            key={blk.id}
                            className="p-3 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-red-900">{blk.date}</span>: {blk.timeStart} às {blk.timeEnd} ({blk.reason})
                            </div>
                            <button
                              onClick={() => handleRemoveBlockedSlot(blk.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Remover bloqueio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal Popup */}
      {reschedulingBooking && (
        <div
          className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setReschedulingBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#EBD6DC] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F0DFE3] pb-3">
              <h4 className="text-base font-serif font-bold text-[#2B2527]">
                Reagendar Atendimento
              </h4>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="text-[#6D5D63]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6F6066]">
              Cliente: <strong>{reschedulingBooking.clientName}</strong> ({reschedulingBooking.serviceName})
            </p>

            {rescheduleError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2527]">Nova Data</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs bg-[#FAF7F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2B2527]">Novo Horário (HH:MM)</label>
                <input
                  type="text"
                  placeholder="Ex: 11:30"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBD6DC] text-xs bg-[#FAF7F6] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReschedulingBooking(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6D5D63] hover:bg-[#FAF7F6]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                className="px-4 py-1.5 rounded-lg bg-[#8C334D] hover:bg-[#77283E] text-white text-xs font-semibold"
              >
                Confirmar Reagendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
