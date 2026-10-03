import { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, Phone, MapPin, Loader2 } from 'lucide-react';
import type { Booking } from '../types';

interface BookingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingTrackerModal({ isOpen, onClose }: BookingTrackerModalProps) {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/bookings/ref/${encodeURIComponent(reference.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Agendamento não encontrado.');
      }

      setResult(data.booking);
    } catch (err: any) {
      setError(err.message || 'Não foi possível encontrar a marcação com essa referência.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmado</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>A aguardar confirmação</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <span>Atendimento concluído</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <span>Cancelado</span>
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <span>Não compareceu</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-[#EBD6DC] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#FAF2F4] border-b border-[#EEDDE2] flex items-center justify-between">
          <h3 className="text-base font-serif font-semibold text-[#2B2527]">
            Consultar o Meu Agendamento
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6A5E63] hover:text-[#2B2527] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs font-semibold text-[#2B2527] block">
              Introduza o código de referência (ex: ER-4091):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ex: ER-1234"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#EBD6DC] focus:border-[#8C334D] text-sm text-[#2B2527] bg-[#FAF7F6] outline-none font-mono"
              />
              <button
                type="submit"
                disabled={loading || !reference.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#8C334D] hover:bg-[#77283E] text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Buscar</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4.5 rounded-2xl bg-[#FAF2F4] border border-[#EBD6DC] space-y-3 text-xs sm:text-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEDDE2]">
                <span className="text-[#7C6C71]">Estado atual:</span>
                {getStatusBadge(result.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6C71]">Referência:</span>
                <span className="font-mono font-semibold text-[#2B2527]">{result.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6C71]">Serviço:</span>
                <span className="font-medium text-[#2B2527]">{result.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6C71]">Data & Hora:</span>
                <span className="font-semibold text-[#8C334D]">{result.date} às {result.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6C71]">Cliente:</span>
                <span className="font-medium text-[#2B2527]">{result.clientName}</span>
              </div>
              <div className="pt-2 border-t border-[#EEDDE2] text-xs text-[#7A6B70] space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C334D]" />
                  <span>Rua de Costa Cabral, 416 · Porto</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8C334D]" />
                  <span>Dúvidas ou alterações: 914 231 627</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
