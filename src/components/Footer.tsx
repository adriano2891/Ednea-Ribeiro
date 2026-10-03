import { MapPin, Phone, Lock, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenTracker: () => void;
}

export default function Footer({ onOpenBooking, onOpenAdmin, onOpenPrivacy, onOpenTracker }: FooterProps) {
  return (
    <footer className="bg-[#241E20] text-[#D8CFD2] pt-16 pb-24 md:pb-16 border-t border-[#3B3235]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#3B3235]">
          {/* Brand & Monogram column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#8C334D] bg-[#332A2D] flex items-center justify-center text-[#F2B6C5] font-serif font-semibold text-sm">
                ER
              </div>
              <span className="text-xl font-serif tracking-wide text-white">
                Ednea Ribeiro
              </span>
            </div>
            <p className="text-xs text-[#ABA0A4] leading-relaxed max-w-sm">
              Espaço de estética e cuidados de beleza no Porto. Manicure, pedicure, unhas de gel, design de sobrancelhas e depilação brasileira com atendimento exclusivo.
            </p>
            <div className="pt-1 text-xs text-[#8C7D82]">
              Fuso horário: <strong>Europe/Lisbon</strong> (Portugal continental)
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#servicos" className="hover:text-[#F2B6C5] transition-colors">
                  Serviços de Estética
                </a>
              </li>
              <li>
                <a href="#trabalhos" className="hover:text-[#F2B6C5] transition-colors">
                  Galeria de Trabalhos
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-[#F2B6C5] transition-colors">
                  Sobre a Ednea
                </a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-[#F2B6C5] transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-[#F2B6C5] transition-colors">
                  Como Chegar ao Espaço
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-[#F2B6C5] transition-colors text-left"
                >
                  Consultar Estado de Agendamento
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Direct Contact */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Localização & Contacto
            </h4>
            <div className="space-y-2 text-xs text-[#ABA0A4]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F2B6C5] shrink-0 mt-0.5" />
                <span>Rua de Costa Cabral, 416 · 4200-208 Porto · Portugal</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F2B6C5] shrink-0" />
                <span>Chamadas e WhatsApp: <strong className="text-white">914 231 627</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#F2B6C5]">@</span>
                <a
                  href="https://www.instagram.com/neiaribeiroesteticista_pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline underline-offset-2"
                >
                  Instagram: neiaribeiroesteticista_pt
                </a>
              </p>
              <p className="text-[11px] text-[#8C7D82] pt-1">
                Atendimento de Segunda a Sábado sob marcação prévia.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-[#8C334D] hover:bg-[#A33D5B] text-white text-xs font-semibold transition-colors"
              >
                Agendar Atendimento Online
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7D82]">
          <p>© {new Date().getFullYear()} Ednea Ribeiro · Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacidade & RGPD</span>
            </button>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Área Profissional</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
