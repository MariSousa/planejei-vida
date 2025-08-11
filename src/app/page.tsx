
'use client';

import { useFinancials } from '@/hooks/use-financials';
import { PrivateRoute } from '@/components/private-route';
import { Skeleton } from '@/components/ui/skeleton';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { BudgetPieChart } from '@/components/dashboard/budget-pie-chart';
import { GoalsProgressCard } from '@/components/dashboard/goals-progress-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { useAuth } from '@/contexts/auth-context';

function DashboardContent() {
  const { user } = useAuth();
  const { totals, goals, income, expenses, isClient } = useFinancials();

  if (!isClient) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[250px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const recentTransactions = [...income, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  return (
    <div className="flex flex-col gap-6">
        <BalanceCard
            greeting={getGreeting()}
            userName={user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
            balance={totals.savings}
        />
        <QuickActions />
        <BudgetPieChart
            totalIncome={totals.totalIncome}
            totalNecessities={totals.totalNecessities}
            totalWants={totals.totalWants}
        />
        <GoalsProgressCard goals={goals} />
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
