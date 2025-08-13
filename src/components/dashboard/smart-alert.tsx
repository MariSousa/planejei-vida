
'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TriangleAlert } from "lucide-react";

interface SmartAlertProps {
    totalWants: number;
    wantsBudget: number;
}

export function SmartAlert({ totalWants, wantsBudget }: SmartAlertProps) {
    if (wantsBudget <= 0) {
        return (
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Dica Rápida!</AlertTitle>
                <AlertDescription>
                    Adicione sua renda mensal para desbloquear insights e dicas personalizadas sobre seu orçamento.
                </AlertDescription>
            </Alert>
        )
    }

    const percentageUsed = (totalWants / wantsBudget) * 100;

    if (percentageUsed < 70) {
        return (
             <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Tudo em ordem!</AlertTitle>
                <AlertDescription>
                   Seus gastos com desejos estão sob controle. Continue assim!
                </AlertDescription>
            </Alert>
        )
    }
    
    return (
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
             <TriangleAlert className="h-4 w-4 !text-yellow-600" />
             <AlertTitle className="text-yellow-900 font-bold">Atenção ao Orçamento</AlertTitle>
             <AlertDescription className="text-yellow-800">
                Você já usou <strong>{percentageUsed.toFixed(0)}%</strong> do seu orçamento para &quot;Desejos&quot;.
             </AlertDescription>
        </Alert>
    )
}
