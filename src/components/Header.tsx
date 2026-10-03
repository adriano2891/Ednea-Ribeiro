import { useState } from 'react';
import { Menu, X, Calendar, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export default function Header({ onOpenBooking, onOpenAdmin, onOpenTracker }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F6]/95 backdrop-blur-md border-b border-[#EEDDE2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display serif font */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif tracking-wide text-[#2B2527] hover:text-[#8C334D] transition-colors"
        >
          Ednea Ribeiro
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A5054]">
          <a href="#servicos" className="hover:text-[#8C334D] transition-colors">
            Serviços
          </a>
          <a href="#trabalhos" className="hover:text-[#8C334D] transition-colors">
            Trabalhos
          </a>
          <a href="#sobre" className="hover:text-[#8C334D] transition-colors">
            Sobre
          </a>
          <a href="#duvidas" className="hover:text-[#8C334D] transition-colors">
            Perguntas
          </a>
          <a href="#localizacao" className="hover:text-[#8C334D] transition-colors">
            Localização
          </a>
          <button
            onClick={onOpenTracker}
            className="hover:text-[#8C334D] transition-colors text-xs text-[#8C334D]/90 font-medium underline underline-offset-4"
          >
            Consultar Reserva
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B5E63] hover:text-[#8C334D] hover:bg-[#F3E2E6]/60 rounded-md transition-colors"
            title="Acesso reservado à profissional"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Gestão</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#8C334D] hover:bg-[#77283E] active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar agora</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5A5054] hover:text-[#2B2527] focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F6] border-b border-[#EEDDE2] px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-[#5A5054]">
            <a
              href="#servicos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#8C334D] transition-colors"
            >
              Serviços de Estética
            </a>
            <a
              href="#trabalhos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#8C334D] transition-colors"
            >
              Galeria de Trabalhos
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#8C334D] transition-colors"
            >
              Sobre a Ednea Ribeiro
            </a>
            <a
              href="#duvidas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#8C334D] transition-colors"
            >
              Perguntas Frequentes
            </a>
            <a
              href="#localizacao"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#8C334D] transition-colors"
            >
              Localização & Contactos
            </a>
            <div className="pt-2 border-t border-[#EEDDE2] flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracker();
                }}
                className="text-sm text-[#8C334D] font-medium"
              >
                Consultar o meu agendamento
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-[#7B6E73] flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Painel
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
