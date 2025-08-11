
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function InvestmentTypesPageContent() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Tipos de Investimento</h1>
        <p className="text-muted-foreground mt-2">
          Aprenda sobre os diferentes horizontes de investimento e encontre as melhores opções para seus objetivos.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Introdução: O Primeiro Passo no Mundo dos Investimentos</CardTitle>
            <CardDescription>
              A jornada para a independência financeira e a construção de um patrimônio sólido começa com a educação e o planejamento. Para o investidor iniciante no Brasil, a vasta gama de opções e a complexidade de termos como CDI, Selic e Imposto de Renda podem parecer intimidantes. Este guia foi elaborado para desmistificar o universo dos investimentos de baixo risco, fornecendo uma base sólida para a tomada de decisões conscientes e seguras.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-foreground">
                Antes de adentrar nas modalidades de investimento, é crucial estabelecer uma premissa fundamental: a organização financeira precede o investimento. Um alicerce financeiro instável é o principal obstáculo para o sucesso na jornada do investidor. O controle de gastos, a elaboração de um orçamento pessoal e a quitação de dívidas com juros altos são etapas indispensáveis.
            </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Curto Prazo</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed">
            <p className="mb-4">
              São considerados investimentos de curto prazo aqueles cujo resgate ocorrerá em até dois anos. Por conta do prazo, é sempre indicado que o investidor escolha investimentos mais conservadores para compor sua carteira.
            </p>
            <p className="mb-4">
              Um planejamento adequado, alinhando os objetivos com os investimentos, permitirá ao investidor escolher as melhores opções que ofereçam bons rendimentos e a liquidez necessária sem comprometer sua organização financeira.
            </p>
            <p>
              Exemplos incluem a poupança, CDBs com liquidez diária e Fundos de Renda Fixa atrelados ao CDI. A poupança, por exemplo, permite depósitos e resgates a qualquer momento e oferece baixo risco, ideal para quem busca segurança.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Médio Prazo</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed">
            <p className="mb-4">
              Podemos considerar investimentos de médio prazo aqueles cujo resgate ocorrerá, em média, entre 2 e 5 anos. São a opção ideal para quem quer mais segurança e menos risco.
            </p>
            <p className="mb-4">
              Há diversas opções, como Certificados de Depósito Bancário (CDB), Letras de Crédito Imobiliário (LCI) e Letras de Crédito do Agronegócio (LCA).
            </p>
            <p>
              Os CDBs são um dos principais exemplos, com prazos que variam de 2 a 1800 dias. É um investimento ideal para pessoas que não gostam de correr riscos e preferem ter mais segurança.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Longo Prazo</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed">
            <p className="mb-4">
              Os investimentos de longo prazo são aqueles em que se pretende resgatar o valor aplicado após cinco anos. Um exemplo dessa opção são os fundos de investimento.
            </p>
            <p className="mb-4">
              O mercado financeiro oferece diversas modalidades de fundos, como Fundos de Renda Fixa, Fundos Multimercado, Fundos Cambiais e Fundos de Ações.
            </p>
            <p>
              Para escolher um fundo, é importante ter em mente suas necessidades e objetivos de longo prazo e observar três atributos básicos: rentabilidade, liquidez e segurança. Antes de contratar, conheça o perfil da instituição, as taxas, as condições de resgate e verifique se os riscos são compatíveis com seu perfil.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function InvestmentTypesPage() {
    return (
        <PrivateRoute>
            <InvestmentTypesPageContent />
        </PrivateRoute>
    );
}
