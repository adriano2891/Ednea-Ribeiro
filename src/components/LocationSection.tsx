import { MapPin, Phone, MessageSquare, Clock, ExternalLink, Calendar } from 'lucide-react';

interface LocationSectionProps {
  onOpenBooking: () => void;
}

export default function LocationSection({ onOpenBooking }: LocationSectionProps) {
  const whatsappUrl = `https://wa.me/351914231627?text=${encodeURIComponent(
    'Olá Ednea, gostaria de informações sobre os serviços de estética e disponibilidade de agendamento na Rua de Costa Cabral.'
  )}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Rua de Costa Cabral 416 Porto Portugal'
  )}`;

  return (
    <section id="localizacao" className="py-16 md:py-24 bg-[#FAF7F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Schedule */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8C334D] font-semibold mb-2">
                Localização & Contactos
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2527] font-normal tracking-tight">
                Venha Visitar o Espaço no Porto
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#685B60] leading-relaxed">
                Estamos prontas para recebê-la com conforto, discrição e todos os cuidados na Rua de Costa Cabral.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Address card */}
              <div className="p-5 rounded-2xl bg-white border border-[#EEDDE2] flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2F4] text-[#8C334D] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#2B2527]">Morada</h3>
                  <p className="text-sm text-[#5C5055] mt-0.5">
                    Rua de Costa Cabral, 416
                  </p>
                  <p className="text-xs text-[#8A797F]">
                    4200-208 Porto · Portugal
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#8C334D] hover:underline"
                  >
                    <span>Abrir rota no Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone and WhatsApp card */}
              <div className="p-5 rounded-2xl bg-white border border-[#EEDDE2] flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2F4] text-[#8C334D] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#2B2527]">Contacto Direto & WhatsApp</h3>
                  <p className="text-base font-semibold text-[#8C334D] mt-0.5">
                    <a href="tel:914231627" className="hover:underline">
                      914 231 627
                    </a>
                  </p>
                  <p className="text-xs text-[#8A797F] mt-0.5">
                    Chamadas e mensagens de esclarecimento
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366]/10 text-[#1E7E34] hover:bg-[#25D366]/20 text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Conversar por WhatsApp</span>
                    </a>
                    <a
                      href="https://www.instagram.com/neiaribeiroesteticista_pt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF2F4] text-[#8C334D] hover:bg-[#F3E2E6] text-xs font-semibold transition-colors border border-[#E9CAD2]"
                    >
                      <span>Instagram @neiaribeiroesteticista_pt</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="p-5 rounded-2xl bg-white border border-[#EEDDE2] flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FAF2F4] text-[#8C334D] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#2B2527]">Horário de Atendimento</h3>
                  <div className="text-xs text-[#5C5055] mt-1 space-y-1">
                    <div className="flex justify-between max-w-xs">
                      <span>Segunda a Sexta-feira:</span>
                      <span className="font-medium text-[#2B2527]">09:00 – 19:00</span>
                    </div>
                    <div className="flex justify-between max-w-xs">
                      <span>Sábado:</span>
                      <span className="font-medium text-[#2B2527]">09:00 – 18:00</span>
                    </div>
                    <div className="flex justify-between max-w-xs text-[#A08F94]">
                      <span>Domingo & Feriados:</span>
                      <span>Encerrado</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8A797F] mt-2 italic">
                    * Horários de Portugal continental (Europe/Lisbon). Atendimento sob marcação prévia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual & Final Call to Action */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Visual Map Frame */}
            <div className="bg-white rounded-3xl p-3 border border-[#EEDDE2] shadow-md flex-1 min-h-[300px] flex flex-col overflow-hidden">
              <div className="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden bg-[#F6EEF1] border border-[#EBD6DC] flex flex-col items-center justify-center p-6 text-center">
                {/* Clean map styling illustration */}
                <div className="w-16 h-16 rounded-full bg-white shadow-md border border-[#E2CCD2] flex items-center justify-center text-[#8C334D] mb-4">
                  <MapPin className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="text-lg font-serif font-semibold text-[#2B2527]">
                  Rua de Costa Cabral, 416
                </h4>
                <p className="text-xs text-[#6F6066] max-w-sm mt-1 mb-4">
                  Zona dos Combatentes e Marquês no Porto. Excelente acessibilidade por metro e autocarro.
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#8C334D] hover:bg-[#FAF2F4] border border-[#DCA2B1] text-xs font-semibold shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver no Google Maps interativo</span>
                </a>
              </div>
            </div>

            {/* Final Call to Action Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#8C334D] text-white shadow-lg space-y-4">
              <h3 className="text-2xl font-serif font-normal">
                Pronta para reservar o seu momento?
              </h3>
              <p className="text-xs sm:text-sm text-[#F7DDE4] leading-relaxed">
                Garanta o seu horário de manicure, pedicure, gel, sobrancelhas ou depilação no Porto com facilidade.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#8C334D] bg-white hover:bg-[#FAF2F4] rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Atendimento Online</span>
                </button>
                <a
                  href="tel:914231627"
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-white hover:text-[#FAF2F4] border border-white/30 rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ligar 914 231 627</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
