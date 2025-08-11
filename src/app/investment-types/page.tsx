
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
            <CardTitle>O Primeiro Passo no Mundo dos Investimentos</CardTitle>
            <CardDescription>
              A jornada para a independência financeira começa com a educação. Para o investidor iniciante, a vasta gama de opções pode parecer intimidante. Este guia foi elaborado para desmistificar o universo dos investimentos de baixo risco.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-foreground">
                Antes de começar, um alicerce financeiro instável é o principal obstáculo. O controle de gastos, um orçamento pessoal e a quitação de dívidas com juros altos são etapas indispensáveis. O objetivo é identificar para onde seu dinheiro está indo, cortar despesas desnecessárias e usar essa economia para, primeiro, quitar dívidas e, em segundo lugar, construir sua reserva de emergência.
            </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Curto Prazo (até 2 anos)</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              Para objetivos em até dois anos, o ideal é escolher investimentos conservadores e com alta liquidez (facilidade de resgate). Exemplos incluem a Poupança e CDBs com liquidez diária.
            </p>
            <div>
                <h4 className="font-semibold text-foreground mb-2">Caderneta de Poupança</h4>
                <p>É a aplicação mais tradicional. Segura e simples, permite depósitos e resgates a qualquer momento. Seu rendimento é atrelado à taxa SELIC e é importante notar que, para pessoas físicas, o rendimento é isento de Imposto de Renda.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">CDB com Liquidez Diária</h4>
                <p>O Certificado de Depósito Bancário funciona como um empréstimo ao banco. A modalidade com liquidez diária é excelente para reservas de emergência, pois permite o resgate a qualquer momento. O rendimento geralmente é um percentual do CDI e há incidência de Imposto de Renda regressivo (quanto mais tempo investido, menor o imposto).</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Médio Prazo (2 a 5 anos)</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              Para objetivos de médio prazo, como a compra de um carro ou uma viagem, você pode buscar opções um pouco mais rentáveis, mesmo que com menor liquidez.
            </p>
             <div>
                <h4 className="font-semibold text-foreground mb-2">LCI e LCA</h4>
                <p>As Letras de Crédito (Imobiliário e do Agronegócio) são similares aos CDBs, mas o dinheiro captado é direcionado a setores específicos. Seu grande atrativo é a isenção de Imposto de Renda para pessoas físicas, mas geralmente exigem que o dinheiro fique aplicado por um prazo mínimo.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">CDBs de Médio Prazo</h4>
                <p>Bancos oferecem CDBs com prazos maiores e, em troca, oferecem uma rentabilidade melhor (um percentual do CDI mais alto). O resgate só pode ser feito no vencimento, então é crucial alinhar o prazo do investimento com o do seu objetivo.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold">Investimentos de Longo Prazo (acima de 5 anos)</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              Para objetivos como aposentadoria ou independência financeira, o longo prazo permite assumir um pouco mais de risco em busca de maiores rentabilidades.
            </p>
             <div>
                <h4 className="font-semibold text-foreground mb-2">Tesouro Direto</h4>
                <p>Além do Tesouro Selic (ideal para curto prazo), o Tesouro Direto oferece títulos como o Tesouro IPCA+, que protege seu dinheiro da inflação e paga uma taxa de juros real. É uma excelente opção para o longo prazo.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">Fundos de Investimento</h4>
                <p>São "condomínios" de investidores que juntam seus recursos para que um gestor profissional invista em uma carteira diversificada de ativos (renda fixa, ações, etc.). Existem fundos para todos os perfis de risco. É importante ler o regulamento e verificar as taxas de administração.</p>
            </div>
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
