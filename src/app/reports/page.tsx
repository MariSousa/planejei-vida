
'use client';

import { PrivateRoute } from '@/components/private-route';
import { useFinancials } from '@/hooks/use-financials';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportsDownloader } from '@/components/reports-downloader';

function ReportsPageContent() {
    const { income, expenses, debts, goals, advices, isClient } = useFinancials();

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
                <h1 className="text-3xl font-bold font-headline">Relatórios</h1>
                <p className="text-muted-foreground mt-2">
                    Exporte seus dados financeiros para análise ou backup.
                </p>
            </div>
            <ReportsDownloader
                income={income}
                expenses={expenses}
                debts={debts}
                goals={goals}
                advices={advices}
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
