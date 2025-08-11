
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Landmark, PiggyBank, ShieldCheck, TrendingUp, UserCheck, Calculator, BrainCircuit, Receipt, HandCoins, BookOpen, Scale } from 'lucide-react';
import React from 'react';


const guideSections = [
    {
        icon: ShieldCheck,
        title: "O Primeiro Passo: Organização e Reserva",
        description: "Diagnóstico, gestão de dívidas e a importância da reserva de emergência.",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">A base de qualquer estratégia de investimento é um orçamento pessoal bem-estruturado. Esta etapa é crucial para evitar que o dinheiro termine antes do mês e para prevenir o acúmulo de novas dívidas.</p>
                <div>
                    <h4 className="font-semibold">1.1. Diagnóstico e Orçamento: Sabendo para onde seu dinheiro vai</h4>
                    <p>O primeiro passo é fazer um diagnóstico completo da sua situação financeira, listando todas as receitas e despesas. A sugestão é dividir as despesas em três grupos: Gastos Essenciais, Gastos Necessários e Gastos Supérfluos.</p>
                </div>
                <div>
                    <h4 className="font-semibold">1.2. Gestão de Dívidas: Antes de Investir, Quitar</h4>
                    <p>Se houver dívidas, a prioridade deve ser quitá-las, especialmente as que possuem altas taxas de juros, como as do cartão de crédito. Estratégias como o Método Avalanche (pagar as mais caras primeiro) ou Bola de Neve (pagar as menores primeiro) podem ajudar.</p>
                </div>
                 <div>
                    <h4 className="font-semibold">1.3. A Fundação da Segurança: A Reserva de Emergência</h4>
                    <p>A reserva de emergência é um fundo para cobrir despesas inesperadas. A recomendação é ter de 3 a 6 meses de suas despesas mensais guardados. O Tesouro Selic é o investimento mais recomendado para esta finalidade pela sua segurança e liquidez diária.</p>
                </div>
            </div>
        )
    },
    {
        icon: UserCheck,
        title: "Conhecendo os Investimentos de Renda Fixa",
        description: "Entenda o que são CDB, LCI, LCA e o Tesouro Selic, o mais seguro do país.",
        content: (
            <div className="space-y-4">
                <p>A Renda Fixa é a classe de ativos mais indicada para o investidor iniciante, pois suas regras de remuneração são predefinidas. O investidor empresta dinheiro em troca de juros.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Emissor</TableHead>
                            <TableHead>Garantia</TableHead>
                            <TableHead>Tributação (Regra Atual)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>CDB</TableCell>
                            <TableCell>Bancos</TableCell>
                            <TableCell>FGC</TableCell>
                            <TableCell>Tabela regressiva de IR</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>LCI/LCA</TableCell>
                            <TableCell>Bancos</TableCell>
                            <TableCell>FGC</TableCell>
                            <TableCell>Isento de IR</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>Tesouro Selic</TableCell>
                            <TableCell>Governo</TableCell>
                            <TableCell>Tesouro Nacional</TableCell>
                            <TableCell>Tabela regressiva de IR</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    },
    {
        icon: TrendingUp,
        title: "O Motor dos Rendimentos: Selic e CDI",
        description: "Desvende como a taxa básica de juros e o CDI influenciam seus retornos.",
         content: (
            <div className="space-y-4">
                <p>O CDI (Certificado de Depósito Interbancário) é um dos principais indexadores de rentabilidade da renda fixa. A Taxa DI é a média dos juros cobrados em empréstimos diários entre os bancos. Ela está diretamente ligada à Taxa Selic, a taxa básica de juros da economia, o que faz com que elas caminhem juntas.</p>
            </div>
        )
    },
    {
        icon: Receipt,
        title: "O Sócio Obrigatório: Imposto de Renda",
        description: "Saiba como o IR afeta seu lucro e conheça a tabela regressiva.",
        content: (
             <div className="space-y-4">
                <p>Para investimentos como CDB e Tesouro Direto, a tributação do Imposto de Renda segue uma tabela regressiva, ou seja, quanto mais tempo você deixa o dinheiro investido, menor o imposto pago sobre o rendimento.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Prazo do Investimento</TableHead>
                            <TableHead>Alíquota de IR sobre o Rendimento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell>Até 180 dias</TableCell><TableCell>22,5%</TableCell></TableRow>
                        <TableRow><TableCell>De 181 a 360 dias</TableCell><TableCell>20,0%</TableCell></TableRow>
                        <TableRow><TableCell>De 361 a 720 dias</TableCell><TableCell>17,5%</TableCell></TableRow>
                        <TableRow><TableCell>Acima de 720 dias</TableCell><TableCell>15,0%</TableCell></TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    },
];

const GuideItemTrigger = ({ icon: Icon, title, description }: {icon: React.ElementType, title: string, description: string}) => (
    <AccordionTrigger className="text-left hover:no-underline">
        <div className="flex items-center p-4">
             <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    </AccordionTrigger>
);

function InvestmentTypesPageContent() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="text-left">
        <h1 className="text-4xl font-bold font-headline">Guia do Investidor Iniciante</h1>
         <p className="text-muted-foreground mt-2">
            Aprenda os conceitos fundamentais para começar a investir com segurança e confiança.
        </p>
      </div>

       <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                    {guideSections.map((section, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                           <GuideItemTrigger {...section} />
                            <AccordionContent>
                               <div className="px-6 pb-4 border-t pt-4">
                                 {section.content}
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
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
