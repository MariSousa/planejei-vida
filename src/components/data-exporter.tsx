
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

  const convertToCSV = (data: (Income | Expense)[]) => {
    const headers = ['Tipo', 'ID', 'Data', 'Descricao/Categoria', 'Valor'];
    
    const incomeRows = income.map(item => 
        `"Ganho","${item.id}","${new Date(item.date).toLocaleDateString('pt-BR')}","${item.source}",${item.amount}`
    );

    const expenseRows = expenses.map(item => 
         `"Gasto","${item.id}","${new Date(item.date).toLocaleDateString('pt-BR')}","${item.category}",${item.amount}`
    );

    const allRows = [...incomeRows, ...expenseRows];

    return [headers.join(','), ...allRows].join('\n');
  };

  const handleExport = () => {
    const csvContent = convertToCSV([...income, ...expenses]);
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
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
          Faça o download de seus ganhos e gastos em formato CSV para usar em outras ferramentas. A exportação para PDF será adicionada em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={income.length === 0 && expenses.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Exportar para CSV
        </Button>
      </CardContent>
    </Card>
  );
}
