
'use client';

import { PrivateRoute } from '@/components/private-route';
import { useFinancials } from '@/hooks/use-financials';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportsDownloader } from '@/components/reports-downloader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ReportsPageContent() {
    const { 
        reportIncome,
        reportExpenses, 
        reportMonthlyPlanItems, 
        goals, 
        advices,
        investments,
        debts,
        isClient,
        reportMonth,
        setReportMonth,
    } = useFinancials();

    if (!isClient) {
        return (
             <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
             <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Relatórios Mensais</h1>
                <p className="text-muted-foreground mt-2">
                    Selecione um mês para exportar seus dados financeiros para análise ou backup.
                </p>
            </div>

            <div className="flex justify-center items-center gap-4 bg-card p-4 rounded-lg border">
                <Button variant="outline" size="icon" onClick={() => setReportMonth(subMonths(reportMonth, 1))}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold font-headline text-center capitalize w-48">
                    {format(reportMonth, 'MMMM, yyyy', { locale: ptBR })}
                </h2>
                <Button variant="outline" size="icon" onClick={() => setReportMonth(addMonths(reportMonth, 1))}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
            
            <ReportsDownloader
                income={reportIncome}
                expenses={reportExpenses}
                monthlyPlanItems={reportMonthlyPlanItems}
                goals={goals}
                advices={advices}
                investments={investments}
                debts={debts}
            />
        </div>
    );
}


export default function ReportsPage() {
    return (
        <PrivateRoute>
            <ReportsPageContent />
        </PrivateRoute>
    )
}
