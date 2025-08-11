
export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export type Priority = 'Alta' | 'Média' | 'Baixa';
export type Status = 'Previsto' | 'Pago';
export type PlanItemType = 'ganho' | 'gasto';

export interface MonthlyPlanItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  priority: Priority;
  status: Status;
  type: PlanItemType;
  // month is no longer needed here as it's part of the collection path
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
}

export interface Advice {
    id: string;
    goalId: string;
    goalName: string;
    adviceText: string;
    date: string;
}

export interface Contribution {
    id:string;
    amount: number;
    type: 'add' | 'withdraw';
    date: string;
}

export interface CustomCategory {
    id: string;
    name: string;
    date: string;
    // We can add isFavorite and parentId later
}

export interface Favorite {
    id: string;
    name: string;
    date: string;
}

export interface Investment {
    id: string;
    type: string;
    name: string;
    institution: string;
    amount: number;
    yieldRate: number;
    date: string;
}

export interface Debt {
    id: string;
    name: string;
    originalAmount: number;
    remainingAmount: number; 
    startDate: string;
    dueDate: string;
    status: 'Pendente' | 'Pago';
    monthlyPaymentGoal: number;
    interestRate?: number;
    remainingInstallments: number;
    totalInstallments: number;
    date: string; 
    lastPaymentDate: string | null;
}

export interface SupportTicket {
    id: string;
    subject: string;
    message: string;
    userEmail: string;
    status: 'Aberto' | 'Em Andamento' | 'Fechado';
    date: string;
    userId: string;
}
