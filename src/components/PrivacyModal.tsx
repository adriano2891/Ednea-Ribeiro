import { X, ShieldCheck, Lock, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-[#EBD6DC] shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4.5 bg-[#FAF2F4] border-b border-[#EEDDE2] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#8C334D]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-serif font-semibold text-[#2B2527]">
              Política de Privacidade & Proteção de Dados
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6A5E63] hover:text-[#2B2527] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#5D5054] leading-relaxed">
          <p>
            O espaço <strong>Ednea Ribeiro - Estética & Unhas</strong>, sediado na Rua de Costa Cabral, 416, 4200-208 Porto, respeita integralmente a privacidade dos seus utilizadores em cumprimento do Regulamento Geral sobre a Proteção de Dados (RGPD).
          </p>

          <h4 className="text-sm font-semibold text-[#2B2527] pt-2">
            1. Dados Recolhidos
          </h4>
          <p>
            Recolhemos exclusivamente os dados estritamente necessários para a gestão e confirmação do seu agendamento:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome completo (para identificação no salão);</li>
            <li>Contacto telefónico (para envio da confirmação, lembretes de atendimento e avisos relevantes via chamada ou WhatsApp);</li>
            <li>Serviço selecionado e notas opcionais que decida partilhar relativamente às suas unhas ou cuidados.</li>
          </ul>

          <h4 className="text-sm font-semibold text-[#2B2527] pt-2">
            2. Finalidade e Prazo de Conservação
          </h4>
          <p>
            Os seus dados nunca são vendidos, partilhados ou cedidos a terceiros para efeitos de publicidade ou marketing. São mantidos apenas pelo período necessário para a prestação dos serviços e arquivo legal das reservas.
          </p>

          <h4 className="text-sm font-semibold text-[#2B2527] pt-2">
            3. Direitos da Titular
          </h4>
          <p>
            Poderá a qualquer momento solicitar o acesso, retificação ou eliminação dos seus dados registados na nossa base de dados mediante contacto telefónico para o <strong>914 231 627</strong> ou presencialmente no nosso espaço no Porto.
          </p>

          <h4 className="text-sm font-semibold text-[#2B2527] pt-2">
            4. Cookies & Tecnologias
          </h4>
          <p>
            Este sítio utiliza apenas cookies e identificadores de sessão estritamente essenciais ao funcionamento do agendamento e da segurança, dispensando rastreamento comportamental de publicidade de terceiros.
          </p>
        </div>

        <div className="px-6 py-4 bg-[#FAF7F6] border-t border-[#EEDDE2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#8C334D] hover:bg-[#77283E] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Entendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
