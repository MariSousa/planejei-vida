
'use client';

import { useState, useEffect } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { PrivateRoute } from '@/components/private-route';
import { Skeleton } from '@/components/ui/skeleton';
import { GoalsProgressCard } from '@/components/dashboard/goals-progress-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useAuth } from '@/contexts/auth-context';
import { SummaryCard } from '@/components/summary-card';
import { TrendingUp, TrendingDown, Target, Landmark } from 'lucide-react';
import { BudgetPieChart } from '@/components/dashboard/budget-pie-chart';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

function DashboardContent() {
  const { user } = useAuth();
  const { totals, goals, income, expenses, isClient, debts } = useFinancials();
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

  if (!isClient) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const recentTransactions = [...income, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const totalDebts = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.remainingAmount, 0);

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold font-headline">{greeting}, {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}!</h1>
            <p className="text-muted-foreground">Aqui está um resumo da sua vida financeira este mês.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard 
                title="Ganhos do Mês"
                value={formatCurrency(totals.totalIncome)}
                icon={<TrendingUp className="text-green-500" />}
                className="border-green-500/50"
            />
             <SummaryCard 
                title="Gastos do Mês"
                value={formatCurrency(totals.totalExpenses)}
                icon={<TrendingDown className="text-red-500" />}
                className="border-red-500/50"
            />
            <SummaryCard 
                title="Saldo para Metas"
                value={formatCurrency(totals.totalSavedForGoals)}
                icon={<Target className="text-blue-500" />}
                className="border-blue-500/50"
            />
            <SummaryCard 
                title="Compromissos a Pagar"
                value={formatCurrency(totalDebts)}
                icon={<Landmark className="text-yellow-500" />}
                className="border-yellow-500/50"
            />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
                 <BudgetPieChart
                    totalIncome={totals.totalIncome}
                    totalNecessities={totals.totalNecessities}
                    totalWants={totals.totalWants}
                />
            </div>
             <div className="lg:col-span-1">
                 <GoalsProgressCard goals={goals} />
            </div>
        </div>

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
