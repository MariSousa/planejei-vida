
'use client';

import { useState } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, CheckCircle, Circle, CalendarIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Debt } from '@/types';
import { AddDebtDialog } from '@/components/add-debt-dialog';
import { Progress } from '@/components/ui/progress';

function DebtsPageContent() {
  const { debts, addDebt, removeDebt, updateDebtStatus, isClient } = useFinancials();
  const { toast } = useToast();

  const handleStatusChange = async (debt: Debt) => {
    const newStatus = debt.status === 'Pendente' ? 'Pago' : 'Pendente';
    await updateDebtStatus(debt.id, newStatus);
     toast({
      title: 'Status Alterado!',
      description: `O compromisso "${debt.name}" foi marcado como ${newStatus}.`,
    });
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd/MM/yyyy");
  }

  const totalDebts = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.remainingAmount, 0);
  const totalOriginal = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.originalAmount, 0);
  const totalPaid = totalOriginal > 0 ? totalOriginal - totalDebts : 0;
  const progress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;


  if (!isClient) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[150px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold font-headline">Compromissos Financeiros</h1>
             <AddDebtDialog />
        </div>
     
      <Card>
        <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>O valor total dos seus compromissos pendentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalDebts)}</p>
            <Progress value={progress} className="mt-2 h-2" />
            <p className="text-sm text-muted-foreground mt-2">Você já quitou {progress.toFixed(0)}% dos seus compromissos!</p>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-4">
        {debts.length > 0 ? (
            debts.map((item) => (
            <Card key={item.id} className={cn('transition-all', item.status === 'Pago' && 'bg-muted/50')}>
                <CardHeader className="flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className={cn("text-lg", item.status === 'Pago' && 'line-through')}>{item.name}</CardTitle>
                        <CardDescription>Vence em: {formatDate(item.dueDate)}</CardDescription>
                    </div>
                     <div className="text-right">
                        <p className={cn("font-bold text-lg", item.status === 'Pago' && 'line-through')}>{formatCurrency(item.remainingAmount)}</p>
                        {item.monthlyPaymentGoal && (
                           <p className="text-xs text-muted-foreground">Meta: {formatCurrency(item.monthlyPaymentGoal)}/mês</p>
                        )}
                    </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleStatusChange(item)}>
                        {item.status === 'Pago' ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <Circle className="h-4 w-4 mr-2" />}
                        {item.status === 'Pago' ? 'Pago' : 'Marcar como pago'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeDebt(item.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                    </Button>
                </CardFooter>
            </Card>
            ))
        ) : (
            <div className="flex h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">Nenhum compromisso registrado.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function DebtsPage() {
    return (
        <PrivateRoute>
            <DebtsPageContent />
        </PrivateRoute>
    )
}
