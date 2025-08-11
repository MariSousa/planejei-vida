'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { Income, Expense, MonthlyPlanItem, Goal, Advice, Investment, Debt } from '@/types';

interface ReportsDownloaderProps {
  income: Income[];
  expenses: Expense[];
  monthlyPlanItems: MonthlyPlanItem[];
  goals: Goal[];
  advices: Advice[];
  investments: Investment[];
  debts: Debt[];
}

type ReportType = 'income' | 'expenses' | 'monthlyPlanItems' | 'goals' | 'advices' | 'investments' | 'debts';

export function ReportsDownloader({ income, expenses, monthlyPlanItems, goals, advices, investments, debts }: ReportsDownloaderProps) {

  const dataMap = { income, expenses, monthlyPlanItems, goals, advices, investments, debts };

  const getReportTitle = (type: ReportType): string => {
    const titles = {
        income: 'Relatório de Ganhos',
        expenses: 'Relatório de Gastos',
        monthlyPlanItems: 'Relatório de Planejamento Mensal',
        goals: 'Relatório de Sonhos',
        advices: 'Relatório de Conselhos do FinMentor',
        investments: 'Relatório de Investimentos',
        debts: 'Relatório de Compromissos',
    };
    return titles[type];
  }

  const getHeaders = (type: ReportType): string[] => {
    const data = dataMap[type];
    if (!data || data.length === 0) return [];

    const ignoredFields = ['id', 'goalId', 'date', 'lastPaymentDate'];
    
    // Mapeamento de nomes de campos para cabeçalhos em português
    const headerTranslations: Record<string, string> = {
        name: 'Nome',
        monthlyPaymentGoal: 'Parcela Mensal',
        originalAmount: 'Valor Original',
        remainingAmount: 'Valor Restante',
        interestRate: 'Taxa de Juros (% a.m.)',
        status: 'Status',
        startDate: 'Data de Início',
        dueDate: 'Vencimento',
        totalInstallments: 'Total de Parcelas',
        remainingInstallments: 'Parcelas Restantes',
        source: 'Fonte',
        amount: 'Valor',
        category: 'Categoria',
        institution: 'Instituição',
        yieldRate: 'Taxa Rendimento (% CDI)',
        type: 'Tipo',
        priority: 'Prioridade',
        goalName: 'Nome da Meta',
        adviceText: 'Conselho',
        targetAmount: 'Valor Alvo',
        currentAmount: 'Valor Atual',
    };

    const debtHeaderOrder = [
        'name', 'monthlyPaymentGoal', 'originalAmount', 'remainingAmount', 'interestRate', 'status', 'startDate', 'dueDate', 'totalInstallments', 'remainingInstallments'
    ];

    const headers = Object.keys(data[0]).filter(header => !ignoredFields.includes(header));
    
    if (type === 'debts') {
        const orderedHeaders = debtHeaderOrder.filter(key => headers.includes(key));
        return orderedHeaders.map(key => headerTranslations[key] || key);
    }
    
    return headers.map(header => headerTranslations[header] || header);
  };
  
  const getBodyRows = (type: ReportType): string[][] => {
      const data = dataMap[type];
      if (!data || data.length === 0) return [];
      
      const ignoredFields = ['id', 'goalId', 'date', 'lastPaymentDate'];
      
      const debtHeaderOrder = [
        'name', 'monthlyPaymentGoal', 'originalAmount', 'remainingAmount', 'interestRate', 'status', 'startDate', 'dueDate', 'totalInstallments', 'remainingInstallments'
      ];
      
      const headers = Object.keys(data[0]).filter(h => !ignoredFields.includes(h));

      const orderedHeaders = type === 'debts' ? debtHeaderOrder.filter(key => headers.includes(key)) : headers;

      return data.map(item =>
          orderedHeaders.map(header => {
              const value = (item as any)[header];
              if (typeof value === 'number' && ['amount', 'targetAmount', 'currentAmount', 'yieldRate', 'monthlyPaymentGoal', 'originalAmount', 'remainingAmount'].includes(header)) {
                  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
              }
              if (['date', 'dueDate', 'lastPaymentDate', 'startDate'].includes(header) && value) {
                  try {
                      return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  } catch (e) {
                      return String(value);
                  }
              }
              if (header === 'adviceText') {
                return String(value).replace(/\n/g, '<br/>');
              }
              return String(value ?? '-');
          })
      );
  };

  const generateReportHtml = (type: ReportType) => {
    const title = getReportTitle(type);
    const headers = getHeaders(type);
    const rows = getBodyRows(type);

    const styles = `
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa; 
            margin: 0;
            padding: 20px; 
        }
        .container { 
            max-width: 90%; 
            margin: auto; 
            background: #fff; 
            border-radius: 8px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
            padding: 2rem; 
            overflow-x: auto;
        }
        h1 { 
            font-size: 1.75rem;
            color: #212529; 
            border-bottom: 2px solid #dee2e6; 
            padding-bottom: 0.5rem; 
            margin-bottom: 1.5rem; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
        }
        th, td { 
            border: 1px solid #dee2e6; 
            padding: 12px 15px; 
            text-align: left; 
            vertical-align: top;
        }
        th { 
            background-color: #f1f3f5; 
            font-weight: 600; 
            text-transform: capitalize; 
        }
        tr:nth-child(even) { 
            background-color: #f8f9fa; 
        }
        tr:hover { 
            background-color: #e9ecef; 
        }
        .no-data { 
            text-align: center; 
            padding: 20px; 
            color: #6c757d; 
            font-style: italic;
        }
    `;

    const tableHtml = rows.length > 0 ? `
        <table>
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
        </table>
    ` : `<p class="no-data">Nenhum dado disponível para este relatório.</p>`;

    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>${styles}</style>
        </head>
        <body>
            <div class="container">
                <h1>${title}</h1>
                ${tableHtml}
            </div>
        </body>
        </html>
    `;
  };

  const handleViewReport = (type: ReportType) => {
    const htmlContent = generateReportHtml(type);
    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
    } else {
        alert("Por favor, habilite pop-ups para visualizar o relatório.");
    }
  };
  
  const reportOptions = [
      { type: 'income' as ReportType, title: 'Relatório de Ganhos', description: 'Todas as suas fontes de renda registradas no mês selecionado.' },
      { type: 'expenses' as ReportType, title: 'Relatório de Gastos', description: 'Todos os seus gastos, detalhados por categoria, no mês selecionado.' },
      { type: 'monthlyPlanItems' as ReportType, title: 'Relatório de Planejamento', description: 'Seus itens de planejamento para o mês selecionado.' },
      { type: 'investments' as ReportType, title: 'Relatório de Investimentos', description: 'Um resumo de toda a sua carteira de investimentos.' },
      { type: 'debts' as ReportType, title: 'Relatório de Compromissos', description: 'Todos os seus compromissos financeiros pendentes e pagos.' },
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
                        <Button onClick={() => handleViewReport(option.type)} disabled={dataMap[option.type].length === 0}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar Relatório
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
