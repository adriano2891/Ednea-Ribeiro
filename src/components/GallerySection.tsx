import { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Instagram, ArrowUpRight } from 'lucide-react';

import gelNailsImg from '../assets/images/service_unhas_gel_1791023795960.jpg';
import manicureImg from '../assets/images/service_manicure_1791023812924.jpg';
import pedicureImg from '../assets/images/service_pedicure_1791023830295.jpg';
import eyebrowImg from '../assets/images/service_sobrancelhas_1791023843509.jpg';
import depilacaoImg from '../assets/images/service_depilacao_1791023856563.jpg';
import portraitImg from '../assets/images/ednea_portrait.png';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  image: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Unhas de Gel com Acabamento e Brilho Impecável',
    category: 'Unhas de Gel',
    categoryKey: 'gel',
    image: gelNailsImg,
    description: 'Extensão e reforço com gel em tom nude rosado, alta durabilidade e acabamento refinado por Neia Ribeiro.'
  },
  {
    id: '2',
    title: 'Manicure & Tratamento Cuidadoso de Cutículas',
    category: 'Manicure',
    categoryKey: 'manicure',
    image: manicureImg,
    description: 'Embelezamento das unhas naturais com corte e alinhamento minucioso, hidratação e esmaltação perfeita.'
  },
  {
    id: '3',
    title: 'Pedicure Spa & Relaxamento dos Pés',
    category: 'Pedicure',
    categoryKey: 'pedicure',
    image: pedicureImg,
    description: 'Cuidado técnico profundo para pés macios, hidratação intensiva e corte milimétrico.'
  },
  {
    id: '4',
    title: 'Design & Harmonização de Sobrancelhas',
    category: 'Sobrancelhas',
    categoryKey: 'sobrancelhas',
    image: eyebrowImg,
    description: 'Alinhamento e design preciso que valoriza o olhar respeitando as proporções naturais do rosto.'
  },
  {
    id: '5',
    title: 'Depilação Brasileira & Cuidados de Pele',
    category: 'Depilação',
    categoryKey: 'depilacao',
    image: depilacaoImg,
    description: 'Procedimento realizado com ceras suaves e técnica delicada, proporcionando conforto e pele acetinada.'
  },
  {
    id: '6',
    title: 'Ednea (Neia) Ribeiro · Esteticista no Porto',
    category: 'Profissional',
    categoryKey: 'profissional',
    image: portraitImg,
    description: 'Atendimento exclusivo e dedicado no espaço da Rua de Costa Cabral, 416, no Porto.'
  }
];

const CATEGORIES = [
  { key: 'all', label: 'Todos os trabalhos' },
  { key: 'gel', label: 'Unhas de Gel' },
  { key: 'manicure', label: 'Manicure' },
  { key: 'pedicure', label: 'Pedicure' },
  { key: 'sobrancelhas', label: 'Sobrancelhas' },
  { key: 'depilacao', label: 'Depilação' },
  { key: 'profissional', label: 'A Profissional' }
];

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.categoryKey === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="trabalhos" className="py-16 md:py-24 bg-[#F8F2F4]/60 border-t border-[#F0DFE3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-[#8C334D] font-semibold mb-2">
            Galeria de Trabalhos
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2527] font-normal tracking-tight">
            Detalhes que Revelam a Sua Elegância
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#685B60] leading-relaxed">
            Fotografias dos procedimentos realizados por Neia Ribeiro, valorizando o acabamento natural, a simetria e a durabilidade.
          </p>
        </div>

        {/* Filter Controls (Segmented clean control adhering to anti-slop rules) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-[#8C334D] text-white shadow-sm'
                  : 'bg-white text-[#5F5156] hover:bg-[#F2DFE4] hover:text-[#2B2527] border border-[#E8D4DA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-[#EBD6DC] shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F5DEE4] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 bg-white/90 text-[#8C334D] rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ZoomIn className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <span className="text-xs text-[#8C334D] font-medium block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-serif text-[#2B2527] font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#6F6066] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Profile CTA box */}
        <div className="mt-12 text-center p-6 bg-white rounded-2xl border border-[#EBD6DC] shadow-xs max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-full bg-[#FAF2F4] text-[#8C334D] flex items-center justify-center shrink-0">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#2B2527]">
                Acompanhe o Instagram Oficial
              </h4>
              <p className="text-xs text-[#7A6B70]">
                Veja novos trabalhos e novidades em @neiaribeiroesteticista_pt
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/neiaribeiroesteticista_pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C334D] hover:bg-[#77283E] text-white text-xs font-semibold whitespace-nowrap shadow-xs transition-all"
          >
            <span>Ver no Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1F191B] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar inside Lightbox */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <span className="text-xs text-[#F2B6C5] font-medium">
                  {filteredItems[activeLightboxIndex].category}
                </span>
                <h4 className="text-base font-serif">
                  {filteredItems[activeLightboxIndex].title}
                </h4>
              </div>
              <button
                onClick={closeLightbox}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fechar fotografia"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image display */}
            <div className="relative max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden">
              <img
                src={filteredItems[activeLightboxIndex].image}
                alt={filteredItems[activeLightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    aria-label="Fotografia anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    aria-label="Próxima fotografia"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            <div className="px-5 py-3 bg-[#181314] text-xs sm:text-sm text-neutral-300">
              {filteredItems[activeLightboxIndex].description}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
