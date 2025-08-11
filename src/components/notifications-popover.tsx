
'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CalendarClock } from "lucide-react";
import { type Debt } from "@/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationsPopoverProps {
    upcomingPayments: Debt[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
}

export function NotificationsPopover({ upcomingPayments }: NotificationsPopoverProps) {
    const hasNotifications = upcomingPayments.length > 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {hasNotifications && (
                         <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-destructive" />
                    )}
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificações</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Lembretes de Pagamento</h4>
                        <p className="text-sm text-muted-foreground">
                            Seus compromissos que vencem nos próximos 7 dias.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {hasNotifications ? (
                            upcomingPayments.map(payment => (
                                <div key={payment.id} className="grid grid-cols-[25px_1fr_auto] items-start gap-3">
                                     <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                                     <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{payment.name}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <CalendarClock className="w-3 h-3" />
                                            Vence em: {formatDate(payment.dueDate)}
                                        </p>
                                     </div>
                                     <div className="text-sm font-medium text-right">{formatCurrency(payment.amount)}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum compromisso vencendo em breve.</p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
