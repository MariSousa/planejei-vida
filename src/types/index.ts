
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

export interface Debt {
  id: string;
  name: string;
  amount: number;
  date: string;
  dueDate: string;
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
