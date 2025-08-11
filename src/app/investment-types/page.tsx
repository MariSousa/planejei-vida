
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function InvestmentTypesPageContent() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Guia do Investidor Iniciante</h1>
        <p className="text-muted-foreground mt-2">
          Aprenda os conceitos essenciais para começar a investir com segurança e inteligência.
        </p>
      </div>

      <Card className="bg-accent/10 border-accent">
        <CardHeader>
            <CardTitle>O Alicerce da Jornada Financeira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              A jornada no mundo dos investimentos não se inicia com a escolha do ativo perfeito, mas com a construção de um alicerce sólido: a organização das finanças pessoais. Antes de focar em rendimentos e juros, é fundamental estabelecer um controle sobre o próprio dinheiro.
            </p>
             <p>
                Este guia foi estruturado para levar você do diagnóstico financeiro à seleção dos primeiros ativos, com foco em educação e planejamento. O objetivo é desmistificar o processo de investimento, destacando que a disciplina e o conhecimento são os ativos mais valiosos para alcançar a independência financeira.
            </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold">O Primeiro Passo: Organização e Reserva</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-6">
            <p>A base de qualquer estratégia de investimento é um orçamento pessoal bem-estruturado. Esta etapa é crucial para evitar que o dinheiro termine antes do mês e para prevenir o acúmulo de novas dívidas.</p>
            <div>
                <h4 className="font-semibold text-foreground mb-2">1. Diagnóstico e Orçamento</h4>
                <p className="mb-2">Liste todas as suas receitas e despesas. A sugestão é dividir os gastos em três grupos para ter uma visão clara:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Gastos Essenciais:</strong> Despesas de sobrevivência (aluguel, alimentação, transporte).</li>
                    <li><strong>Gastos Necessários:</strong> Importantes para seu padrão de vida (plano de saúde, educação).</li>
                    <li><strong>Gastos Supérfluos:</strong> Lazer e consumo que podem ser ajustados (restaurantes, assinaturas).</li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">2. Gestão de Dívidas</h4>
                <p>Se houver dívidas, a prioridade deve ser quitá-las, especialmente as com juros altos (cartão de crédito, cheque especial). Considere os métodos "Avalanche" (pagar as mais caras primeiro) ou "Bola de Neve" (pagar as menores primeiro para ganhar motivação).</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-2">3. Reserva de Emergência</h4>
                <p>É um fundo para cobrir despesas inesperadas, equivalente a 3 a 6 meses de suas despesas essenciais. O <strong>Tesouro Selic</strong> é o investimento mais recomendado para a reserva, por sua alta segurança e liquidez diária.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold">Conhecendo a Renda Fixa</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              Investir em Renda Fixa é como emprestar dinheiro para uma instituição (banco ou governo) em troca de juros. É o ponto de partida ideal para a maioria dos investidores por sua segurança e previsibilidade.
            </p>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Principais Ativos de Renda Fixa</CardTitle>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Característica</TableHead>
                                <TableHead>CDB</TableHead>
                                <TableHead>Tesouro Selic</TableHead>
                                <TableHead>LCI/LCA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Emissor</TableCell>
                                <TableCell>Bancos</TableCell>
                                <TableCell>Governo Federal</TableCell>
                                <TableCell>Bancos</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">Garantia</TableCell>
                                <TableCell>FGC (até R$ 250 mil)</TableCell>
                                <TableCell>Tesouro Nacional</TableCell>
                                <TableCell>FGC (até R$ 250 mil)</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">Rentabilidade</TableCell>
                                <TableCell>Atrelada ao CDI</TableCell>
                                <TableCell>Atrelada à Taxa Selic</TableCell>
                                <TableCell>Atrelada ao CDI</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Liquidez</TableCell>
                                <TableCell>Pode ser diária</TableCell>
                                <TableCell>Diária</TableCell>
                                <TableCell>Geralmente baixa</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Imposto de Renda</TableCell>
                                <TableCell>Tabela Regressiva</TableCell>
                                <TableCell>Tabela Regressiva</TableCell>
                                <TableCell>Isento (regra atual)</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold">O Motor dos Rendimentos: Selic e CDI</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              A rentabilidade da Renda Fixa é ditada por duas taxas fundamentais na economia brasileira. Entendê-las é crucial.
            </p>
            <div>
                <h4 className="font-semibold text-foreground mb-2">Taxa Selic</h4>
                <p>É a taxa básica de juros do Brasil, definida pelo Banco Central. Ela influencia todas as outras taxas de juros do país, de empréstimos a financiamentos. O Tesouro Selic, por exemplo, rende exatamente a variação da Selic.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">CDI (Certificado de Depósito Interbancário)</h4>
                <p>É uma taxa que representa a média dos juros que os bancos cobram para emprestar dinheiro entre si. O valor do CDI anda sempre "colado" na Selic. A maioria dos investimentos de Renda Fixa privados, como CDBs, LCIs e LCAs, usa o CDI como referência. Um investimento que rende "110% do CDI" terá um retorno 10% superior à taxa DI no período.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-semibold">O Sócio Obrigatório: Imposto de Renda</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              O Imposto de Renda (IR) incide sobre os rendimentos da maioria dos investimentos. A boa notícia é que, na Renda Fixa, quanto mais tempo você deixa seu dinheiro aplicado, menos imposto paga.
            </p>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Tabela Regressiva do Imposto de Renda</CardTitle>
                    <CardDescription>Válida para CDB, Tesouro Direto, Fundos de Renda Fixa, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Prazo do Investimento</TableHead>
                                <TableHead className="text-right">Alíquota de IR</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Até 180 dias</TableCell>
                                <TableCell className="text-right font-mono">22,5%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>De 181 a 360 dias</TableCell>
                                <TableCell className="text-right font-mono">20,0%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>De 361 a 720 dias</TableCell>
                                <TableCell className="text-right font-mono">17,5%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Acima de 720 dias</TableCell>
                                <TableCell className="text-right font-mono">15,0%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <div className="pt-4">
                <h4 className="font-semibold text-foreground mb-2">Cenário de Mudanças (Proposta)</h4>
                <p>Fique atento: uma Medida Provisória (1.303/2025) propõe mudar as regras a partir de 2026. A proposta inclui o fim da isenção de IR para LCI/LCA (passando para 5%) e uma alíquota única de 17,5% para CDBs e Tesouro. Acompanhar essas discussões é parte importante da vida do investidor.</p>
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
