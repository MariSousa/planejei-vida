
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import type { Income, Expense, Debt, Goal, Advice } from '@/types';

interface ReportsDownloaderProps {
  income: Income[];
  expenses: Expense[];
  debts: Debt[];
  goals: Goal[];
  advices: Advice[];
}

type ReportType = 'income' | 'expenses' | 'debts' | 'goals' | 'advices';

export function ReportsDownloader({ income, expenses, debts, goals, advices }: ReportsDownloaderProps) {

  const dataMap = { income, expenses, debts, goals, advices };

  const convertToCSV = (type: ReportType) => {
    const data = dataMap[type];
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => 
        headers.map(header => JSON.stringify((item as any)[header])).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const handleExport = (type: ReportType, format: 'csv' | 'pdf') => {
    if (format === 'pdf') {
      // PDF export logic will go here
      console.log(`Exporting ${type} to PDF...`);
      return;
    }

    const csvContent = convertToCSV(type);
    if (!csvContent) return;
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `planejei_${type}_${new Date().toLocaleDateString('pt-BR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const reportOptions = [
      { type: 'income' as ReportType, title: 'Relatório de Ganhos', description: 'Todas as suas fontes de renda registradas.' },
      { type: 'expenses' as ReportType, title: 'Relatório de Gastos', description: 'Todos os seus gastos, detalhados por categoria.' },
      { type: 'debts' as ReportType, title: 'Relatório de Compromissos', description: 'Suas dívidas e contas a pagar.' },
      { type: 'goals' as ReportType, title: 'Relatório de Sonhos', description: 'O progresso de todas as suas metas financeiras.' },
      { type: 'advices' as ReportType, title: 'Relatório de Conselhos', description: 'Todos os conselhos gerados pelo FinMentor.' },
  ];

  return (
    <div className="space-y-6">
        {reportOptions.map(option => (
            <Card key={option.type}>
                <CardHeader>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => handleExport(option.type, 'csv')} disabled={dataMap[option.type].length === 0}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Exportar para CSV
                        </Button>
                        <Button variant="outline" disabled>
                             <FileText className="mr-2 h-4 w-4" />
                            Exportar para PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
