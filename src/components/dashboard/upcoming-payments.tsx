'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Debt } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UpcomingPaymentsProps {
    payments: Debt[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMM", { locale: ptBR });
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Próximos Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
                 {payments.length > 0 ? (
                    <div className="space-y-4">
                        {payments.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-muted-foreground w-16 text-center">{formatDate(item.dueDate)}</span>
                                    <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="font-semibold text-right">{formatCurrency(item.monthlyPaymentGoal)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-[100px] w-full items-center justify-center rounded-lg border-2 border-dashed p-4">
                        <p className="text-center text-sm text-muted-foreground">Nenhum pagamento programado para os próximos dias.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
