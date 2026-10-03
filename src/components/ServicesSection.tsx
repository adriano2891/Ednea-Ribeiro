import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import type { Service, Settings } from '../types';

import gelNailsImg from '../assets/images/service_unhas_gel_1791023795960.jpg';
import manicureImg from '../assets/images/service_manicure_1791023812924.jpg';
import pedicureImg from '../assets/images/service_pedicure_1791023830295.jpg';
import eyebrowImg from '../assets/images/service_sobrancelhas_1791023843509.jpg';
import depilacaoImg from '../assets/images/service_depilacao_1791023856563.jpg';

interface ServicesSectionProps {
  services: Service[];
  promoInfo?: Settings['promoInfo'];
  onSelectService: (service: Service) => void;
}

const SERVICE_IMAGES: Record<string, string> = {
  'manicure': manicureImg,
  'pedicure': pedicureImg,
  'unhas-gel': gelNailsImg,
  'sobrancelhas': eyebrowImg,
  'depilacao-brasileira': depilacaoImg
};

export default function ServicesSection({ services, promoInfo, onSelectService }: ServicesSectionProps) {
  return (
    <section id="servicos" className="py-16 md:py-24 bg-[#FAF7F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-[#8C334D] font-semibold mb-2">
            Cuidados & Estética Profissional
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2527] font-normal tracking-tight">
            Serviços no Espaço ou no Conforto do Seu Domicílio
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#685B60] leading-relaxed">
            Procedimentos realizados com técnicas cuidadas, produtos de qualidade e higiene rigorosa por Neia Ribeiro — na Rua de Costa Cabral ou na comodidade da sua casa no Porto.
          </p>
        </div>

        {/* Domicile Highlight Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-white border border-[#EBD6DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F3] text-[#8C334D] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2B2527]">
                Atendimento ao Domicílio em Todo o Grande Porto
              </h3>
              <p className="text-xs text-[#6F6066]">
                Deslocação com marquesa portátil, produtos descartáveis e todo o material profissional até à sua residência.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#8C334D] bg-[#FAF2F4] px-3 py-1.5 rounded-lg border border-[#E8CCD4] whitespace-nowrap">
            Gabinete ou Casa
          </span>
        </div>

        {/* Promotional Banner (Only shown if Ednea Ribeiro has confirmed its validity and conditions) */}
        {promoInfo && promoInfo.enabled && promoInfo.confirmedByProfessional && (
          <div className="mb-12 p-6 rounded-2xl bg-[#F8E7EC] border border-[#E9BFCC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#8C334D] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Campanha Especial Confirmada</span>
              </div>
              <h3 className="text-xl font-serif text-[#2B2527] font-medium">
                {promoInfo.title} · {promoInfo.price} €
              </h3>
              <p className="text-xs sm:text-sm text-[#5D5054] max-w-xl">
                {promoInfo.description}
              </p>
              {promoInfo.conditions && (
                <p className="text-xs text-[#8A797F] italic">
                  Condições: {promoInfo.conditions}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                const s = services.find((srv) => srv.id === 'unhas-gel') || services[0];
                if (s) onSelectService(s);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8C334D] hover:bg-[#77283E] rounded-xl whitespace-nowrap shadow-sm transition-all"
            >
              Aproveitar Campanha
            </button>
          </div>
        )}

        {/* Services Grid with Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const photo = SERVICE_IMAGES[service.id] || manicureImg;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EEDDE2] hover:border-[#DCA2B1] transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with zoom effect */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#FAF2F4] relative">
                    <img
                      src={photo}
                      alt={`${service.name} no espaço de estética de Neia Ribeiro no Porto`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#8C334D]">
                      {service.category}
                    </div>
                  </div>

                  <div className="p-6 pb-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#78696F] mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8C334D]" />
                        <span>Duração estimada: ~{service.durationMinutes} min</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-serif text-[#2B2527] font-medium group-hover:text-[#8C334D] transition-colors">
                      {service.name}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-[#63575C] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="p-6 pt-3 mt-2 border-t border-[#F2E5E8] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8A7A80] block">Preço</span>
                    <span className="text-sm font-semibold text-[#2B2527]">
                      {service.price !== null ? `${service.price} €` : 'Sob consulta'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#8C334D] bg-[#FAF2F4] hover:bg-[#8C334D] hover:text-white rounded-lg transition-all"
                  >
                    <span>Agendar este serviço</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clarification Note on Pricing & Schedule Transparency */}
        <div className="mt-10 p-4 rounded-xl bg-[#FAF2F4]/80 border border-[#EEDDE2] text-center text-xs text-[#7B6E73] max-w-2xl mx-auto">
          <p>
            Valores e durações podem ser ajustados com base nas necessidades individuais da sua unha ou pele.
            Para dúvidas ou pedidos especiais, fale diretamente no WhatsApp através do <strong>914 231 627</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
