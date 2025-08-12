'use client';

import { useState, useEffect } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { PrivateRoute } from '@/components/private-route';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { SummaryCard } from '@/components/summary-card';
import { TrendingDown, Wallet, PiggyBank, Scale, Lightbulb, TriangleAlert, BadgeCheck } from 'lucide-react';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { GoalsProgressCard } from '@/components/dashboard/goals-progress-card';
import { FinancialHealthGauge } from '@/components/dashboard/financial-health-gauge';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExpensesReviewDialog } from '@/components/dashboard/expenses-review-dialog';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

function DashboardContent() {
  const { user } = useAuth();
  const { totals, goals, income, expenses, isClient, debts, upcomingPayments, investments, previousTotals } = useFinancials();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bom dia';
      if (hour < 18) return 'Boa tarde';
      return 'Boa noite';
    }
    setGreeting(getGreeting());
  }, []);

  const financialHealth = totals.totalIncome > 0 ? ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100 : 0;
  const prevFinancialHealth = previousTotals.totalIncome > 0 ? ((previousTotals.totalIncome - previousTotals.totalExpenses) / previousTotals.totalIncome) * 100 : 0;
  
  const getHealthStatus = (score: number) => {
    if (score > 66) return { name: 'Saudável', icon: BadgeCheck, color: 'text-green-500', description: 'Excelente! Você está no caminho certo. Que tal usar parte da sua sobra para acelerar uma meta ou fazer um novo investimento?' };
    if (score > 33) return { name: 'Em Atenção', icon: TriangleAlert, color: 'text-yellow-500', description: 'Cuidado! Seus gastos estão próximos da sua renda. Revise suas despesas variáveis e veja onde pode economizar.' };
    return { name: 'Crítico', icon: TriangleAlert, color: 'text-red-500', description: 'Alerta vermelho! Seus gastos superaram sua renda. É crucial cortar despesas não essenciais imediatamente.' };
  };

  const healthStatus = getHealthStatus(financialHealth);
  const StatusIcon = healthStatus.icon;


  if (!isClient) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
         <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const recentTransactions = [...income, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const totalDebts = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.remainingAmount, 0);
  const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">{greeting}, {user?.displayName?.split(' ')[0] || 'Usuário'}!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <FinancialHealthGauge healthScore={financialHealth} previousHealthScore={prevFinancialHealth} />
            <Card className="flex flex-col justify-center">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <StatusIcon className={`h-8 w-8 ${healthStatus.color} mt-1`} />
                        <div>
                             <h3 className="font-semibold mb-2">Plano de Ação Rápido</h3>
                             <p className="text-sm text-muted-foreground">
                                {healthStatus.description}
                             </p>
                            <ExpensesReviewDialog expenses={expenses} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 grid-cols-2">
            <SummaryCard 
                title="Saldo disponível"
                value={formatCurrency(totals.savings)}
                icon={<Wallet />}
            />
             <SummaryCard 
                title="Gasto no mês"
                value={formatCurrency(totals.totalExpenses)}
                icon={<TrendingDown />}
            />
            <SummaryCard 
                title="Reservado para dívidas"
                value={formatCurrency(totalDebts)}
                icon={<Scale />}
            />
            <SummaryCard 
                title="Poupança acumulada"
                value={formatCurrency(totalInvested)}
                icon={<PiggyBank />}
            />
        </div>

        <GoalsProgressCard goals={goals} />
        
        <UpcomingPayments payments={upcomingPayments} />

        <RecentActivity transactions={recentTransactions} />
    </div>
  );
}


export default function Dashboard() {
    return (
        <PrivateRoute>
            <DashboardContent />
        </PrivateRoute>
    )
}
