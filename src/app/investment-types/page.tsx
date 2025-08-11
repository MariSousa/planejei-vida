
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Landmark, PiggyBank, ShieldCheck, TrendingUp, UserCheck, Calculator, BrainCircuit, Receipt } from 'lucide-react';
import React from 'react';

const guideSections = [
    {
        icon: ShieldCheck,
        title: "O Primeiro Passo: Organização e Reserva",
        description: "Diagnóstico, gestão de dívidas e a importância da reserva de emergência.",
    },
    {
        icon: UserCheck,
        title: "Perfil de Investidor",
        description: "Determine seu perfil e como ele influencia suas escolhas de investimentos.",
    },
    {
        icon: Landmark,
        title: "Conhecendo a Renda Fixa",
        description: "Entenda o que são CDB, LCI, LCA e o Tesouro Selic, o mais seguro do país.",
    },
    {
        icon: TrendingUp,
        title: "O Motor dos Rendimentos: Selic e CDI",
        description: "Desvende como a taxa básica de juros e o CDI influenciam seus retornos.",
    },
    {
        icon: Receipt,
        title: "O Sócio Obrigatório: Imposto de Renda",
        description: "Saiba como o IR afeta seu lucro e conheça a tabela regressiva.",
    },
    {
        icon: BrainCircuit,
        title: "Estratégias e Erros Comuns",
        description: "Aprenda sobre diversificação, aportes e os erros que você deve evitar.",
    },
    {
        icon: Calculator,
        title: "Ferramentas e Próximos Passos",
        description: "Use simuladores e aprenda a montar e acompanhar sua primeira carteira.",
    },
];

const GuideItem = ({ icon: Icon, title, description }: typeof guideSections[0]) => (
    <div className="border-b last:border-b-0">
        <div className="flex items-center p-4">
             <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
        </div>
    </div>
);


function InvestmentTypesPageContent() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="text-left">
        <h1 className="text-4xl font-bold font-headline">Guia do Investidor Iniciante</h1>
      </div>

       <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {guideSections.map((section, index) => (
                        <GuideItem key={index} {...section} />
                    ))}
                </div>
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
