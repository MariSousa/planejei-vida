
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { getIconForCategory } from '@/lib/categories';
import { type Expense } from '@/types';
import Link from 'next/link';

interface ExpensesReviewDialogProps {
  expenses: Expense[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function ExpensesReviewDialog({ expenses }: ExpensesReviewDialogProps) {
    const [open, setOpen] = useState(false);

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto mt-2">
                    Revisar meus gastos
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Resumo de Gastos do Mês</DialogTitle>
                    <DialogDescription>
                        Aqui está uma lista de todos os seus gastos registrados neste mês. Para editar ou excluir, vá para a página de gastos.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length > 0 ? (
                            expenses.map((item) => {
                                const Icon = getIconForCategory(item.category);
                                return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        {item.category}
                                    </TableCell>
                                    <TableCell>{new Date(item.date).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                </TableRow>
                                )
                            })
                            ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">Nenhuma despesa registrada este mês.</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                         {expenses.length > 0 && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(totalExpenses)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Fechar</Button>
                    </DialogClose>
                    <Button asChild>
                        <Link href="/expenses">Ir para a página de gastos</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
