
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type Income, type Expense, type Debt, type Goal, type Advice, type Contribution } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, runTransaction, where } from 'firebase/firestore';
import { addDays, isAfter, isBefore, startOfToday } from 'date-fns';

const necessityCategories = [
    'Aluguel', 'Financiamento', 'Condomínio', 'IPTU', 'Luz', 'Água', 'Gás', 
    'Internet', 'Telefone', 'Supermercado', 'Padaria', 'Açougue/Peixaria', 
    'Combustível', 'Transporte Público', 'Manutenção Veículo', 'IPVA/Licenciamento', 
    'Plano de Saúde', 'Farmácia', 'Consultas', 'Exames', 'Dentista', 
    'Mensalidade', 'Material Escolar', 'Transporte Escolar', 'Seguro Residencial', 
    'Seguro Veículo', 'Impostos', 'Empréstimos', 'Fatura Cartão', 
    'Previdência Privada', 'Pensão', 'Ração', 'Veterinário'
];

const wantCategories = [
    'Streaming TV', 'Manutenção', 'Limpeza', 'Restaurante', 'Lanchonete', 
    'Delivery', 'Café', 'Bebidas', 'App de Transporte', 'Estacionamento', 
    'Pedágio', 'Lavagem Veículo', 'Óculos/Lentes', 'Academia', 'Terapias', 
    'Cursos', 'Livros', 'Cinema/Teatro', 'Shows/Eventos', 'Viagens', 
    'Streaming', 'Assinaturas', 'Hobbies', 'Roupas/Calçados', 'Lavanderia', 
    'Salão/Barbearia', 'Cosméticos', 'Higiene Pessoal', 'Utensílios', 
    'Eletrodomésticos', 'Móveis/Decoração', 'Produtos de Limpeza', 
    'Higiene Pet', 'Pet Shop', 'Presentes', 'Doações', 'Eventos Especiais', 'Outros'
];


export const useFinancials = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMonthlyQuery = (col: string) => {
    if (!user) return null;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    // Debts are ordered by due date, not creation date
    if (col === 'debts') {
        return query(
            collection(db, `users/${user.uid}/${col}`),
            orderBy('dueDate', 'asc')
        );
    }
    
    return query(
        collection(db, `users/${user.uid}/${col}`),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth),
        orderBy('date', 'desc')
    );
  }

  useEffect(() => {
    if (user) {
      const incomeQuery = getMonthlyQuery('income');
      const unsubscribeIncome = incomeQuery ? onSnapshot(incomeQuery, (querySnapshot) => {
        const incomeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));
        setIncome(incomeData);
      }) : () => {};

      const expensesQuery = getMonthlyQuery('expenses');
      const unsubscribeExpenses = expensesQuery ? onSnapshot(expensesQuery, (querySnapshot) => {
        const expensesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
        setExpenses(expensesData);
      }) : () => {};

      const debtsQuery = getMonthlyQuery('debts');
      const unsubscribeDebts = debtsQuery ? onSnapshot(debtsQuery, (querySnapshot) => {
        const debtsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Debt));
        setDebts(debtsData);
      }) : () => {};
      
      const goalsQuery = query(collection(db, `users/${user.uid}/goals`), orderBy('date', 'desc'));
      const unsubscribeGoals = onSnapshot(goalsQuery, (querySnapshot) => {
        const goalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
        setGoals(goalsData);
      });
      
      const adviceQuery = getMonthlyQuery('advices');
      const unsubscribeAdvices = adviceQuery ? onSnapshot(adviceQuery, (querySnapshot) => {
          const adviceData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advice));
          setAdvices(adviceData);
      }) : () => {};

      return () => {
        unsubscribeIncome();
        unsubscribeExpenses();
        unsubscribeDebts();
        unsubscribeGoals();
        unsubscribeAdvices();
      };
    } else {
        setIncome([]);
        setExpenses([]);
        setDebts([]);
        setGoals([]);
        setAdvices([]);
    }
  }, [user]);

  const addDocWithDate = async (collectionName: string, data: any) => {
      if (!user) return;
      await addDoc(collection(db, `users/${user.uid}/${collectionName}`), {
          ...data,
          date: new Date().toISOString()
      });
  }
  
  const deleteDocById = async (collectionName: string, id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, `users/${user.uid}/${collectionName}`, id));
  }

  const addIncome = useCallback((newIncome: Omit<Income, 'id' | 'date'>) => addDocWithDate('income', newIncome), [user]);
  const addExpense = useCallback((newExpense: Omit<Expense, 'id' | 'date'>) => addDocWithDate('expenses', newExpense), [user]);
  const addDebt = useCallback((newDebt: Omit<Debt, 'id' | 'date'>) => addDocWithDate('debts', newDebt), [user]);
  const addGoal = useCallback((newGoal: Omit<Goal, 'id' | 'date'>) => addDocWithDate('goals', newGoal), [user]);
  const addAdvice = useCallback((newAdvice: Omit<Advice, 'id' | 'date'>) => addDocWithDate('advices', newAdvice), [user]);

  const removeIncome = useCallback((id: string) => deleteDocById('income', id), [user]);
  const removeExpense = useCallback((id: string) => deleteDocById('expenses', id), [user]);
  const removeDebt = useCallback((id: string) => deleteDocById('debts', id), [user]);
  const removeGoal = useCallback((id: string) => deleteDocById('goals', id), [user]);
  const removeAdvice = useCallback((id: string) => deleteDocById('advices', id), [user]);

  const updateGoalContribution = useCallback(async (goalId: string, amount: number, type: 'add' | 'withdraw') => {
    if (!user) return;
    const goalRef = doc(db, `users/${user.uid}/goals`, goalId);
    
    await runTransaction(db, async (transaction) => {
        const goalDoc = await transaction.get(goalRef);
        if (!goalDoc.exists()) {
            throw "Goal does not exist!";
        }

        const currentAmount = goalDoc.data().currentAmount || 0;
        const newAmount = type === 'add' ? currentAmount + amount : currentAmount - amount;

        if (newAmount < 0) {
            throw "Withdrawal amount cannot be greater than the current amount.";
        }
        
        transaction.update(goalRef, { currentAmount: newAmount });

        const contributionData: Omit<Contribution, 'id'> = {
            amount,
            type,
            date: new Date().toISOString()
        };
        const contributionRef = doc(collection(db, `users/${user.uid}/goals/${goalId}/contributions`));
        transaction.set(contributionRef, contributionData);
    });
  }, [user]);
  
  const totals = useMemo(() => {
    const totalIncome = income.reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalDebts = debts.reduce((acc, d) => acc + d.amount, 0);
    const totalGoals = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSavedForGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const savings = totalIncome - totalExpenses;

    const totalNecessities = expenses
      .filter(e => necessityCategories.includes(e.category))
      .reduce((acc, e) => acc + e.amount, 0);

    const totalWants = expenses
      .filter(e => wantCategories.includes(e.category))
      .reduce((acc, e) => acc + e.amount, 0);

    return { 
        totalIncome, 
        totalExpenses, 
        totalDebts, 
        savings, 
        totalGoals, 
        totalSavedForGoals,
        totalNecessities,
        totalWants
    };
  }, [income, expenses, debts, goals]);

  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const upcomingPayments = useMemo(() => {
    const today = startOfToday();
    const next7Days = addDays(today, 7);
    return debts.filter(debt => {
        const dueDate = new Date(debt.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, next7Days);
    });
  }, [debts]);

  return {
    income,
    expenses,
    debts,
    goals,
    advices,
    addIncome,
    addExpense,
    addDebt,
    addGoal,
    addAdvice,
    removeIncome,
    removeExpense,
    removeDebt,
    removeGoal,
    removeAdvice,
    updateGoalContribution,
    totals,
    expensesByCategory,
    upcomingPayments,
    isClient,
  };
};
