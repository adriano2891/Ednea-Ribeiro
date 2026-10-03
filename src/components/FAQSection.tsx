import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Como funciona o processo de agendamento online?',
    answer:
      'O processo é muito simples: escolhe o serviço desejado, seleciona a data e um horário livre disponível no calendário, preenche o seu nome e telemóvel e envia o pedido. Receberá imediatamente um código de referência com o estado "A aguardar confirmação". Assim que a Ednea verificar a agenda, receberá a confirmação.'
  },
  {
    question: 'Como posso consultar, reagendar ou cancelar uma reserva?',
    answer:
      'Pode clicar em "Consultar Reserva" no topo da página e introduzir o seu código de referência para ver o estado. Se precisar de alterar a data, hora ou cancelar, pedimos que entre em contacto direto por WhatsApp ou chamada para o número 914 231 627 com pelo menos 24 horas de antecedência, para que o horário possa ser disponibilizado a outra cliente.'
  },
  {
    question: 'A Ednea atende ao domicílio no Porto?',
    answer:
      'Sim! Se preferir o conforto da sua residência, a esteticista Neia Ribeiro realiza atendimento ao domicílio no concelho do Porto e áreas limítrofes. Basta selecionar a opção "Ao Domicílio" ao fazer o seu agendamento no site e indicar a sua morada. A profissional leva marquesa portátil, produtos higienizados e tudo o que é necessário para o procedimento.'
  },
  {
    question: 'Onde fica localizado o espaço e como posso chegar?',
    answer:
      'O espaço situa-se na Rua de Costa Cabral, 416, no Porto. Fica muito próximo da Praça do Marquês e da estação de Metro dos Combatentes e Marquês (Linha D), com paragens de autocarro STCP nas imediações e facilidade de acesso a pé ou de transporte público.'
  },
  {
    question: 'Quais são as formas de pagamento disponíveis?',
    answer:
      'O pagamento é realizado presencialmente no espaço após a conclusão do serviço. São aceites os meios de pagamento usuais (como numerário ou MB Way).'
  },
  {
    question: 'Os horários apresentados no site já consideram o fuso de Portugal?',
    answer:
      'Sim, todo o sistema de agendamento funciona no fuso horário Europe/Lisbon (Portugal continental), com atualização automática entre horário de verão e de inverno, mesmo que esteja a aceder a partir do estrangeiro.'
  },
  {
    question: 'O que devo ter em conta antes do meu atendimento?',
    answer:
      'Pedimos pontualidade para que possamos dedicar todo o tempo necessário ao seu cuidado sem pressas. Caso tenha unhas de gel anteriores aplicadas noutro espaço ou necessidades de pele específicas, pode indicar no campo de observações ao agendar.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-16 md:py-24 bg-[#F8F2F4]/60 border-t border-[#F0DFE3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8C334D] font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Esclarecimentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2527] font-normal tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#685B60]">
            Respostas claras sobre os agendamentos, o espaço e o atendimento na Rua de Costa Cabral.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#EBD6DC] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 font-medium text-[#2B2527] hover:text-[#8C334D] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-serif">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C334D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-[#5D5054] leading-relaxed border-t border-[#F6E8EC]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
