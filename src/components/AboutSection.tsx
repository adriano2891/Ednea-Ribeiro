import { Heart, Sparkles, ShieldCheck, Instagram } from 'lucide-react';
import portraitImg from '../assets/images/ednea_portrait.png';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export default function AboutSection({ onOpenBooking }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-[#FAF7F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/5] bg-[#F5DEE4]">
                <img
                  src={portraitImg}
                  alt="Ednea Ribeiro (Neia Ribeiro), esteticista profissional no Porto"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Subtle Trust badge overlay */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-[#EEDDE2] max-w-[240px]">
                <div className="flex items-center gap-2 text-[#8C334D] mb-1">
                  <Heart className="w-4 h-4 fill-[#8C334D]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Cuidado Individual</span>
                </div>
                <p className="text-xs text-[#5D5054] leading-relaxed">
                  Tempo reservado exclusivamente para si, com dedicação e sem pressas.
                </p>
              </div>
            </div>
          </div>

          {/* Text and Personal Presentation */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#DCA2B1] bg-[#FAF2F4] flex items-center justify-center text-[#8C334D] font-serif font-semibold text-xs tracking-wider">
                ER
              </div>
              <span className="text-xs uppercase tracking-widest text-[#8C334D] font-semibold">
                Sobre a Ednea (Neia) Ribeiro
              </span>
              <span className="text-[#D6B8C2]">·</span>
              <a
                href="https://www.instagram.com/neiaribeiroesteticista_pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[#8C334D] hover:underline flex items-center gap-1"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@neiaribeiroesteticista_pt</span>
              </a>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2527] font-normal tracking-tight">
              Dedicação, Higiene & Amor pelos Cuidados de Beleza
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5D5054] leading-relaxed">
              <p>
                No espaço localizado na <strong>Rua de Costa Cabral, 416, no Porto</strong>, cada atendimento é pensado para ser um momento de pausa, conforto e bem-estar na sua rotina.
              </p>
              <p>
                Com foco especializado em manicure, pedicure, unhas de gel, design de sobrancelhas e depilação brasileira, o objetivo da esteticista Neia Ribeiro é realçar a sua beleza natural através de um trabalho minucioso e com materiais devidamente selecionados.
              </p>
              <p>
                A higiene e o respeito pelo seu tempo são prioridades absolutas. Cada cliente é recebida num ambiente calmo e higienizado, onde pode relaxar enquanto cuida de si.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#EEDDE2] space-y-1">
                <div className="flex items-center gap-2 text-[#8C334D] text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Higiene Rigorosa</span>
                </div>
                <p className="text-[11px] text-[#6F6066]">
                  Instrumentos esterilizados e descartáveis conforme as melhores normas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EEDDE2] space-y-1">
                <div className="flex items-center gap-2 text-[#8C334D] text-xs font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Produtos Confiáveis</span>
                </div>
                <p className="text-[11px] text-[#6F6066]">
                  Géis resistentes e ceras suaves adequadas a peles sensíveis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EEDDE2] space-y-1">
                <div className="flex items-center gap-2 text-[#8C334D] text-xs font-semibold">
                  <Heart className="w-4 h-4" />
                  <span>Atende ao Domicílio</span>
                </div>
                <p className="text-[11px] text-[#6F6066]">
                  Comodidade total na sua casa no Porto com marquesa e mala profissional.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl shadow-sm transition-all"
              >
                <span>Reservar o meu atendimento</span>
              </button>
              <a
                href="https://www.instagram.com/neiaribeiroesteticista_pt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-[#8C334D] bg-[#FAF2F4] hover:bg-[#F3E2E6] rounded-xl transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>Seguir no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
