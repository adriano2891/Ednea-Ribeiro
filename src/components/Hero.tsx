import { Calendar, Sparkles, MapPin, Phone, Instagram, Home } from 'lucide-react';
import portraitImg from '../assets/images/ednea_portrait.png';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#F0DFE3]">
      {/* Background delicate rose tint glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#FBEBED]/70 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5DEE4]/50 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text and Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges: Domicílio & Morada */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-[#DCA2B1] bg-[#FAF2F4] flex items-center justify-center text-[#8C334D] font-serif font-semibold text-xs tracking-wider shadow-sm">
                ER
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] border border-[#E8C2CD] text-xs font-semibold text-[#8C334D]">
                <Home className="w-3.5 h-3.5" />
                <span>Atende ao Domicílio & no Espaço</span>
              </div>

              <div className="text-xs font-medium text-[#7C6C71] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8C334D]" />
                <span>Rua de Costa Cabral, 416 · Porto</span>
              </div>

              <a
                href="https://www.instagram.com/neiaribeiroesteticista_pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[#8C334D] hover:underline flex items-center gap-1 bg-[#FAF2F4] px-2.5 py-1 rounded-full border border-[#E8CDD5]"
              >
                <Instagram className="w-3 h-3" />
                <span>@neiaribeiroesteticista_pt</span>
              </a>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#2B2527] leading-[1.12] tracking-tight">
              Cuide de si.{' '}
              <span className="italic text-[#8C334D] font-normal block sm:inline">
                Reserve o seu momento.
              </span>
            </h1>

            {/* Secondary Support Sentence */}
            <p className="text-lg sm:text-xl text-[#5F5358] max-w-xl font-normal leading-relaxed">
              Manicure, pedicure, unhas de gel e outros cuidados de beleza no Porto.
            </p>

            {/* Domicile highlight callout */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBD6DC] shadow-xs max-w-lg space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C334D] uppercase tracking-wider">
                <Home className="w-4 h-4" />
                <span>Comodidade no seu lar ou no gabinete</span>
              </div>
              <p className="text-xs text-[#5D5054] leading-relaxed">
                Com todo o material esterilizado e equipamentos profissionais, <strong>a esteticista Neia Ribeiro desloca-se até ao seu domicílio</strong> no Porto e arredores, ou recebe-a com total privacidade no espaço da Rua de Costa Cabral.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] active:scale-[0.98] rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar agora (Espaço ou Domicílio)</span>
              </button>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#4C4044] hover:text-[#8C334D] bg-[#F3E2E6]/60 hover:bg-[#EED5DC] rounded-xl transition-all"
              >
                <span>Ver serviços</span>
              </a>
            </div>

            {/* Contact quick trust line */}
            <div className="pt-4 border-t border-[#EEDDE2] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#75666C]">
              <a
                href="tel:914231627"
                className="inline-flex items-center gap-1.5 hover:text-[#8C334D] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C334D]" />
                <span className="font-semibold text-[#2B2527]">914 231 627</span>
              </a>
              <span className="text-[#D6B8C2]">·</span>
              <span className="font-medium text-[#8C334D]">Atendimento ao Domicílio no Porto</span>
              <span className="text-[#D6B8C2]">·</span>
              <span>Segunda a Sábado</span>
            </div>
          </div>

          {/* Hero Visual Asset: Official Portrait of the Professional */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] bg-[#F5DEE4]">
              <img
                src={portraitImg}
                alt="Ednea Ribeiro (Neia Ribeiro) esteticista no Porto, atendimento ao domicílio e no gabinete"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8C334D] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                  Atende ao Domicílio & Espaço Físico
                </span>
                <p className="text-xs uppercase tracking-widest text-[#FCEEF1] font-medium">Porto & Grande Porto</p>
                <p className="text-lg font-serif">Ednea (Neia) Ribeiro · Esteticista</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
