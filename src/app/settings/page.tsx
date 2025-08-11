
'use client';

import { PrivateRoute } from '@/components/private-route';
import { DataExporter } from '@/components/data-exporter';
import { useFinancials } from '@/hooks/use-financials';
import { Skeleton } from '@/components/ui/skeleton';

function SettingsPageContent() {
    const { income, expenses, isClient } = useFinancials();

    if (!isClient) {
        return <Skeleton className="h-48 w-full" />;
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
             <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Configurações</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie suas preferências e dados do aplicativo.
                </p>
            </div>
            <DataExporter income={income} expenses={expenses} />
        </div>
    );
}


export default function SettingsPage() {
    return (
        <PrivateRoute>
            <SettingsPageContent />
        </PrivateRoute>
    )
}
