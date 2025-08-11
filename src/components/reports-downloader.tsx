
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import type { Income, Expense, MonthlyPlanItem, Goal, Advice } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface ReportsDownloaderProps {
  income: Income[];
  expenses: Expense[];
  monthlyPlanItems: MonthlyPlanItem[];
  goals: Goal[];
  advices: Advice[];
}

type ReportType = 'income' | 'expenses' | 'monthlyPlanItems' | 'goals' | 'advices';

export function ReportsDownloader({ income, expenses, monthlyPlanItems, goals, advices }: ReportsDownloaderProps) {

  const dataMap = { income, expenses, monthlyPlanItems, goals, advices };

  const getHeaders = (type: ReportType): string[] => {
    const data = dataMap[type];
    if (!data || data.length === 0) return [];
    // Remove 'id' from headers
    return Object.keys(data[0]).filter(header => header !== 'id');
  };

  const getBody = (type: ReportType): string[][] => {
    const data = dataMap[type];
    const headers = getHeaders(type);
    if (!data || data.length === 0) return [];
    
    return data.map(item =>
        headers.map(header => {
            const value = (item as any)[header];
            if (typeof value === 'number') {
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            }
            if (header.toLowerCase().includes('date')) {
                return new Date(value).toLocaleDateString('pt-BR');
            }
            return String(value);
        })
    );
  };
  
  const convertToCSV = (type: ReportType) => {
    const headers = getHeaders(type);
    const body = getBody(type);
    if (body.length === 0) return '';
    
    const rows = body.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const handleExport = (type: ReportType, format: 'csv' | 'pdf') => {
    const data = dataMap[type];
    if (data.length === 0) return;

    const fileName = `planejei_${type}_${new Date().toLocaleDateString('pt-BR')}`;

    if (format === 'pdf') {
        const doc = new jsPDF();
        const headers = getHeaders(type);
        const body = getBody(type);

        autoTable(doc, {
            head: [headers],
            body: body,
            didDrawPage: (data) => {
                // We can add header/footer here later if needed
            },
        });
        
        doc.save(`${fileName}.pdf`);
        return;
    }

    const csvContent = convertToCSV(type);
    if (!csvContent) return;
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const reportOptions = [
      { type: 'income' as ReportType, title: 'Relatório de Ganhos', description: 'Todas as suas fontes de renda registradas.' },
      { type: 'expenses' as ReportType, title: 'Relatório de Gastos', description: 'Todos os seus gastos, detalhados por categoria.' },
      { type: 'monthlyPlanItems' as ReportType, title: 'Relatório de Planejamento Mensal', description: 'Seus itens de planejamento, incluindo ganhos e gastos previstos.' },
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
                        <Button variant="outline" onClick={() => handleExport(option.type, 'pdf')} disabled={dataMap[option.type].length === 0}>
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
