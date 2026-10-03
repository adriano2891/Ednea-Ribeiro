import { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Loader2,
  Home,
  MapPin
} from 'lucide-react';
import type { Service, AvailableSlot, Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  initialService?: Service | null;
  onBookingCreated?: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  services,
  initialService,
  onBookingCreated
}: BookingModalProps) {
  // Step 1: Service
  // Step 2: Date & Time
  // Step 3: Contact Info
  // Step 4: Review & Submit
  // Step 5: Summary / Confirmation
  const [step, setStep] = useState<number>(1);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [locationType, setLocationType] = useState<'salon' | 'home'>('salon');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Set default initial service or date
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        setSelectedService(initialService);
        setStep(2);
      } else if (!selectedService && services.length > 0) {
        setSelectedService(services[0]);
      }

      // Default date to tomorrow if not set
      if (!selectedDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialService, services]);

  // Fetch slots whenever selectedDate or selectedService changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchSlots(selectedDate, selectedService.id);
    }
  }, [selectedDate, selectedService]);

  const fetchSlots = async (dateStr: string, serviceId: string) => {
    setLoadingSlots(true);
    setErrorMessage(null);
    setSelectedTime('');

    try {
      const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${serviceId}`);
      if (!res.ok) {
        throw new Error('Não foi possível carregar os horários para esta data.');
      }
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao consultar disponibilidade no servidor.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName.trim() || !clientPhone.trim()) {
      setErrorMessage('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (locationType === 'home' && (!clientAddress || clientAddress.trim().length < 5)) {
      setErrorMessage('Por favor indique a sua morada para o atendimento ao domicílio.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          locationType,
          clientAddress: locationType === 'home' ? clientAddress.trim() : '',
          notes: notes.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao submeter o pedido de agendamento.');
      }

      setCreatedBooking(data.booking);
      if (onBookingCreated) {
        onBookingCreated(data.booking);
      }
      setStep(5); // Move to summary
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro no servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService(services[0] || null);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setLocationType('salon');
    setClientAddress('');
    setNotes('');
    setCreatedBooking(null);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  // Format date helper for Portuguese display
  const formatDatePt = (dStr: string) => {
    if (!dStr) return '';
    try {
      const [year, month, day] = dStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-PT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dStr;
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 45); // up to 45 days in advance
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full border border-[#EBD6DC] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-[#FAF2F4] border-b border-[#EEDDE2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#DCA2B1] bg-white flex items-center justify-center text-[#8C334D] font-serif font-semibold text-xs">
              ER
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-[#2B2527]">
                Agendamento de Atendimento
              </h3>
              <p className="text-[11px] text-[#7C6C71]">
                Rua de Costa Cabral, 416 · Porto
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#6A5E63] hover:text-[#2B2527] hover:bg-black/5 transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Only for steps 1-4) */}
        {step < 5 && (
          <div className="px-6 py-3 bg-[#FAF7F6] border-b border-[#F0DFE3] flex items-center justify-between text-xs text-[#7B6D72]">
            <span className={step >= 1 ? 'font-semibold text-[#8C334D]' : ''}>
              1. Serviço
            </span>
            <span>→</span>
            <span className={step >= 2 ? 'font-semibold text-[#8C334D]' : ''}>
              2. Data & Hora
            </span>
            <span>→</span>
            <span className={step >= 3 ? 'font-semibold text-[#8C334D]' : ''}>
              3. Contactos
            </span>
            <span>→</span>
            <span className={step >= 4 ? 'font-semibold text-[#8C334D]' : ''}>
              4. Confirmar
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-serif text-[#2B2527] font-medium">
                  1. Escolha o serviço desejado
                </h4>
                <p className="text-xs text-[#78696F]">
                  Selecione o cuidado que pretende realizar no espaço.
                </p>
              </div>

              <div className="space-y-2.5">
                {services.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#8C334D] bg-[#FAF2F4] ring-1 ring-[#8C334D]'
                          : 'border-[#EBD6DC] hover:border-[#DCA2B1] bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#8C334D]">
                            {srv.category}
                          </span>
                          <span className="text-[11px] text-[#83747A] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{srv.durationMinutes} min
                          </span>
                        </div>
                        <h5 className="text-base font-serif font-medium text-[#2B2527]">
                          {srv.name}
                        </h5>
                        <p className="text-xs text-[#63575C]">{srv.description}</p>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="text-xs font-semibold text-[#2B2527] block">
                          {srv.price !== null ? `${srv.price} €` : 'Sob consulta'}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border mt-2 flex items-center justify-center ml-auto ${
                            isSelected
                              ? 'border-[#8C334D] bg-[#8C334D] text-white'
                              : 'border-[#D6C2C8]'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && selectedService && (
            <div className="space-y-5">
              <div>
                <h4 className="text-lg font-serif text-[#2B2527] font-medium">
                  2. Selecione a data e o horário
                </h4>
                <p className="text-xs text-[#78696F]">
                  Serviço escolhido: <strong>{selectedService.name}</strong> (~{selectedService.durationMinutes} min)
                </p>
                <div className="mt-1 text-[11px] text-[#8C334D] font-medium bg-[#FAF2F4] inline-block px-2.5 py-1 rounded-md">
                  * Horários de Portugal continental (Europe/Lisbon)
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2B2527] flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#8C334D]" />
                  <span>Escolha o dia:</span>
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] focus:ring-1 focus:ring-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none"
                />
                {selectedDate && (
                  <p className="text-xs text-[#6F6066] capitalize">
                    {formatDatePt(selectedDate)}
                  </p>
                )}
              </div>

              {/* Available Slots Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#2B2527] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8C334D]" />
                  <span>Horários disponíveis:</span>
                </label>

                {loadingSlots ? (
                  <div className="p-8 text-center text-xs text-[#7B6E73] flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#8C334D]" />
                    <span>A verificar disponibilidade em tempo real no servidor...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#FBF3F5] border border-[#EBD6DC] text-center text-xs text-[#796A70] space-y-2">
                    <p className="font-semibold text-[#2B2527]">
                      Não existem horários livres na data selecionada.
                    </p>
                    <p>
                      Pode estar encerrado, ser dia de folga ou já estar totalmente preenchido.
                      Por favor experimente outro dia ou contacte o <strong>914 231 627</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-[#8C334D] text-white border-[#8C334D] shadow-sm'
                              : 'bg-white text-[#2B2527] border-[#EBD6DC] hover:border-[#DCA2B1] hover:bg-[#FAF2F4]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info & Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-serif text-[#2B2527] font-medium">
                  3. Local do atendimento e identificação
                </h4>
                <p className="text-xs text-[#78696F]">
                  Escolha se prefere ser atendida no gabinete ou no conforto do seu domicílio.
                </p>
              </div>

              {/* Location Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2B2527] block">
                  Onde deseja realizar o atendimento? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLocationType('salon')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      locationType === 'salon'
                        ? 'border-[#8C334D] bg-[#FAF2F4] ring-1 ring-[#8C334D]'
                        : 'border-[#EBD6DC] bg-white hover:border-[#DCA2B1]'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${locationType === 'salon' ? 'text-[#8C334D]' : 'text-[#7B6E73]'}`} />
                    <div>
                      <span className="text-xs font-semibold text-[#2B2527] block">No Gabinete</span>
                      <span className="text-[11px] text-[#6E6065] block leading-tight">Rua de Costa Cabral, 416, Porto</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationType('home')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      locationType === 'home'
                        ? 'border-[#8C334D] bg-[#FAF2F4] ring-1 ring-[#8C334D]'
                        : 'border-[#EBD6DC] bg-white hover:border-[#DCA2B1]'
                    }`}
                  >
                    <Home className={`w-4 h-4 mt-0.5 shrink-0 ${locationType === 'home' ? 'text-[#8C334D]' : 'text-[#7B6E73]'}`} />
                    <div>
                      <span className="text-xs font-semibold text-[#2B2527] block">Ao Domicílio</span>
                      <span className="text-[11px] text-[#8C334D] font-medium block leading-tight">Na sua residência no Porto</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Domicile address input if home chosen */}
              {locationType === 'home' && (
                <div className="p-3.5 rounded-2xl bg-[#FAF0F3] border border-[#E8C2CD] space-y-2 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-[#8C334D] flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    <span>A sua Morada para o atendimento ao domicílio *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rua, Número de porta, Andar, Código Postal e Freguesia no Porto"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCA2B1] focus:border-[#8C334D] text-xs text-[#2B2527] bg-white outline-none"
                  />
                  <p className="text-[11px] text-[#7A6A70]">
                    * A esteticista Neia Ribeiro desloca-se com todo o equipamento e material higienizado até ao seu endereço.
                  </p>
                </div>
              )}

              <div className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B2527] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8C334D]" />
                    <span>Nome completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Santos"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] focus:ring-1 focus:ring-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B2527] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C334D]" />
                    <span>Telemóvel (Portugal) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 914 231 627"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] focus:ring-1 focus:ring-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none"
                  />
                  <p className="text-[11px] text-[#8A797F]">
                    Número para envio de confirmação e lembrete.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B2527] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8C334D]" />
                    <span>Observações (opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Detalhes de acesso, campainha ou preferências do cuidado..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] focus:ring-1 focus:ring-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Submit */}
          {step === 4 && selectedService && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-serif text-[#2B2527] font-medium">
                  4. Rever e enviar pedido
                </h4>
                <p className="text-xs text-[#78696F]">
                  Por favor confirme os dados antes de gravar a sua reserva.
                </p>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#FAF2F4] border border-[#EBD6DC] space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Serviço:</span>
                  <span className="font-semibold text-[#2B2527]">{selectedService.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Modalidade:</span>
                  <span className="font-semibold text-[#8C334D]">
                    {locationType === 'home' ? 'Ao Domicílio (na sua residência)' : 'No Gabinete (Porto)'}
                  </span>
                </div>
                {locationType === 'home' && clientAddress && (
                  <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                    <span className="text-[#7C6C71]">Morada de Domicílio:</span>
                    <span className="font-medium text-[#2B2527] text-right max-w-xs">{clientAddress}</span>
                  </div>
                )}
                {locationType === 'salon' && (
                  <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                    <span className="text-[#7C6C71]">Espaço:</span>
                    <span className="font-medium text-[#2B2527] text-right">Rua de Costa Cabral, 416, Porto</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Data:</span>
                  <span className="font-semibold text-[#2B2527] capitalize">{formatDatePt(selectedDate)}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Horário:</span>
                  <span className="font-semibold text-[#8C334D]">{selectedTime} (Portugal)</span>
                </div>
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Cliente:</span>
                  <span className="font-medium text-[#2B2527]">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0DFE3] pb-2">
                  <span className="text-[#7C6C71]">Telemóvel:</span>
                  <span className="font-medium text-[#2B2527]">{clientPhone}</span>
                </div>
                {notes && (
                  <div className="flex justify-between pt-1">
                    <span className="text-[#7C6C71]">Observações:</span>
                    <span className="font-normal text-[#2B2527] italic text-right max-w-xs">{notes}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Importante:</p>
                <p>
                  O seu pedido será gravado com o estado <strong>“A aguardar confirmação”</strong>.
                  A Ednea Ribeiro verificará a disponibilidade de agenda e confirmará o agendamento.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Success Summary */}
          {step === 5 && createdBooking && (
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#FAF2F4] text-[#8C334D] border border-[#DCA2B1] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs mb-2">
                  Estado: A aguardar confirmação
                </span>
                <h4 className="text-2xl font-serif text-[#2B2527] font-semibold">
                  Pedido Submetido com Sucesso!
                </h4>
                <p className="text-xs text-[#6B5C62] mt-1 max-w-md mx-auto">
                  O seu pedido foi recebido no sistema. Guarde a referência abaixo para consulta.
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-5 rounded-2xl bg-[#FAF2F4] border border-[#EBD6DC] text-left space-y-2.5 max-w-md mx-auto text-xs sm:text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-[#EEDDE2]">
                  <span className="text-[#7C6C71]">Código de Referência:</span>
                  <span className="font-mono font-bold text-base text-[#8C334D]">
                    {createdBooking.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C6C71]">Serviço:</span>
                  <span className="font-medium text-[#2B2527]">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C6C71]">Modalidade:</span>
                  <span className="font-semibold text-[#8C334D]">
                    {createdBooking.locationType === 'home' ? 'Ao Domicílio' : 'No Gabinete (Costa Cabral)'}
                  </span>
                </div>
                {createdBooking.locationType === 'home' && createdBooking.clientAddress && (
                  <div className="flex justify-between">
                    <span className="text-[#7C6C71]">Endereço:</span>
                    <span className="font-medium text-[#2B2527] text-right">{createdBooking.clientAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#7C6C71]">Data e Hora:</span>
                  <span className="font-medium text-[#2B2527]">
                    {formatDatePt(createdBooking.date)} às {createdBooking.time}
                  </span>
                </div>
              </div>

              {/* WhatsApp direct notification action */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBD6DC] text-xs space-y-3 max-w-md mx-auto">
                <p className="text-[#5F5156]">
                  Deseja avisar a Ednea imediatamente pelo WhatsApp para agilizar a confirmação?
                </p>
                <a
                  href={`https://wa.me/351914231627?text=${encodeURIComponent(
                    `Olá Ednea, acabei de submeter o agendamento no site!\nReferência: ${createdBooking.reference}\nServiço: ${createdBooking.serviceName}\nModalidade: ${createdBooking.locationType === 'home' ? 'Ao Domicílio em ' + (createdBooking.clientAddress || '') : 'No Gabinete (Costa Cabral)'}\nData: ${createdBooking.date} às ${createdBooking.time}\nNome: ${createdBooking.clientName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar mensagem no WhatsApp (914 231 627)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-[#FAF7F6] border-t border-[#EEDDE2] flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#5D5054] hover:text-[#2B2527] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              type="button"
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl transition-all disabled:opacity-50 ml-auto"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={!selectedDate || !selectedTime || loadingSlots}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl transition-all disabled:opacity-50"
            >
              <span>Preencher Dados</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={!clientName.trim() || clientPhone.trim().length < 9 || (locationType === 'home' && clientAddress.trim().length < 5)}
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl transition-all disabled:opacity-50"
            >
              <span>Rever Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitBooking}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl transition-all disabled:opacity-50 shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A validar horário no servidor...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gravar e Enviar Pedido</span>
                </>
              )}
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full py-2.5 px-5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl transition-all"
            >
              Concluir e Voltar ao Site
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
