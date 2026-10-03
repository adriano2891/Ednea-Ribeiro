import { Calendar, Phone } from 'lucide-react';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export default function MobileBottomBar({ onOpenBooking }: MobileBottomBarProps) {
  return (
    <aside
      aria-label="Ações rápidas móveis"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F6]/95 backdrop-blur-md border-t border-[#EBD6DC] px-4 py-2.5 shadow-lg"
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <a
          href="tel:914231627"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#DCA2B1] bg-white text-[#8C334D] text-xs font-semibold shrink-0 active:bg-[#FAF2F4] transition-colors"
          aria-label="Ligar para Ednea Ribeiro"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>914 231 627</span>
        </a>

        <button
          onClick={onOpenBooking}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#8C334D] active:bg-[#77283E] text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agendar Atendimento</span>
        </button>
      </div>
    </aside>
  );
}
