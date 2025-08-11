
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import type { Income, Expense } from '@/types';

interface DataExporterProps {
  income: Income[];
  expenses: Expense[];
}

export function DataExporter({ income, expenses }: DataExporterProps) {

  const convertToCSV = (data: (Income | Expense)[], type: 'income' | 'expense') => {
    const headers = type === 'income' 
      ? ['id', 'source', 'amount', 'date'] 
      : ['id', 'category', 'amount', 'date'];

    const rows = data.map(item => {
      const date = new Date(item.date).toISOString();
      if (type === 'income' && 'source' in item) {
          return [item.id, `"${item.source}"`, item.amount, date].join(',');
      }
      if (type === 'expense' && 'category' in item) {
          return [item.id, `"${item.category}"`, item.amount, date].join(',');
      }
      return '';
    }).filter(Boolean);

    return [headers.join(','), ...rows].join('\n');
  };

  const handleExport = () => {
    const incomeCSV = convertToCSV(income, 'income');
    const expensesCSV = convertToCSV(expenses, 'expense');

    const csvContent = `Tipo,ID,Descricao/Categoria,Valor,Data\n` +
     income.map(i => `Ganho,${i.id},"${i.source}",${i.amount},${new Date(i.date).toISOString()}`).join('\n') + '\n' +
     expenses.map(e => `Gasto,${e.id},"${e.category}",${e.amount},${new Date(e.date).toISOString()}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'planejei_dados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Seus Dados</CardTitle>
        <CardDescription>
          Faça o download de seus ganhos e gastos em formato CSV para usar em outras ferramentas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={income.length === 0 && expenses.length === 0}>
          <Download className="mr-2" />
          Exportar para CSV
        </Button>
      </CardContent>
    </Card>
  );
}
