
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

export interface MonthlyPlanItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  priority: Priority;
  status: Status;
  month: string; // YYYY-MM format
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
    id: string;
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
