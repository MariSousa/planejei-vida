'use client';

import { useState, useEffect } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { PrivateRoute } from '@/components/private-route';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { SummaryCard } from '@/components/summary-card';
import { TrendingDown, Wallet, PiggyBank, Scale, Lightbulb } from 'lucide-react';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { GoalsProgressCard } from '@/components/dashboard/goals-progress-card';
import { FinancialHealthGauge } from '@/components/dashboard/financial-health-gauge';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';
import { Card, CardContent } from '@/components/ui/card';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

function DashboardContent() {
  const { user } = useAuth();
  const { totals, goals, income, expenses, isClient, debts, upcomingPayments, investments } = useFinancials();
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
  const financialHealth = totals.totalIncome > 0 ? ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">{greeting}, {user?.displayName?.split(' ')[0] || 'Usuário'}!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <FinancialHealthGauge healthScore={financialHealth} />
            <Card className="flex flex-col justify-center">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Lightbulb className="h-8 w-8 text-yellow-400 mt-1" />
                        <div>
                             <h3 className="font-semibold mb-2">Entenda seu Medidor</h3>
                             <p className="text-sm text-muted-foreground">
                                Este medidor é como um termômetro para suas finanças do mês. Ele simplesmente mostra o quanto da sua renda está sobrando após pagar os gastos. Não se preocupe com os termos técnicos, o objetivo é simples: quanto mais 'saudável' o medidor, mais perto você está dos seus sonhos!
                             </p>
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
