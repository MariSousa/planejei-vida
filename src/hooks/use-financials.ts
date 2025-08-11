
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type Income, type Expense, type MonthlyPlanItem, type Goal, type Advice, type Contribution, type CustomCategory, type Favorite, type Priority, type Status, type PlanItemType } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, runTransaction, where, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { addDays, isAfter, isBefore, startOfToday, format, getYear, getMonth, set } from 'date-fns';

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
  const [monthlyPlanItems, setMonthlyPlanItems] = useState<MonthlyPlanItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonthlyQuery = (col: string) => {
    if (!user) return null;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    return query(
        collection(db, `users/${user.uid}/${col}`),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth),
        orderBy('date', 'desc')
    );
  }

  useEffect(() => {
    if (user) {
      const collections = ['income', 'expenses', 'goals', 'advices', 'categories', 'favorites'];
      const setters: any = {
        income: setIncome,
        expenses: setExpenses,
        goals: setGoals,
        advices: setAdvices,
        categories: setCustomCategories,
        favorites: setFavorites
      };

      const unsubscribes = collections.map(col => {
        let q;
        if (['income', 'expenses'].includes(col)) {
          q = getMonthlyQuery(col);
        } else {
          q = query(collection(db, `users/${user.uid}/${col}`), orderBy('date', 'desc'));
        }
        
        if (!q) return () => {};

        return onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setters[col](data);
        });
      });

      setIsClient(true);

      return () => {
        unsubscribes.forEach(unsub => unsub());
      };
    } else {
        setIncome([]);
        setExpenses([]);
        setMonthlyPlanItems([]);
        setGoals([]);
        setAdvices([]);
        setCustomCategories([]);
        setFavorites([]);
    }
  }, [user]);

  // Specific listener for monthly plan items
  useEffect(() => {
    if (user) {
      const monthStr = format(currentMonth, 'yyyy-MM');
      const q = query(
        collection(db, `users/${user.uid}/monthlyPlan`),
        where('month', '==', monthStr),
        orderBy('dueDate', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyPlanItem));
        setMonthlyPlanItems(items);
      });
      
      return () => unsubscribe();
    }
  }, [user, currentMonth]);


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
  
  const addPlanItem = useCallback(async (item: Omit<MonthlyPlanItem, 'id' | 'month' | 'status'>) => {
    if (!user) return;
    const month = format(new Date(item.dueDate), 'yyyy-MM');
    await addDoc(collection(db, `users/${user.uid}/monthlyPlan`), {
        ...item,
        month,
        status: 'Previsto' as Status
    });
  }, [user]);

  const updatePlanItemStatus = useCallback(async (id: string, status: Status) => {
    if (!user) return;
    const itemRef = doc(db, `users/${user.uid}/monthlyPlan`, id);
    await updateDoc(itemRef, { status });
  }, [user]);

  const removePlanItem = useCallback((id: string) => deleteDocById('monthlyPlan', id), [user]);

  const addGoal = useCallback((newGoal: Omit<Goal, 'id' | 'date'>) => addDocWithDate('goals', newGoal), [user]);
  const addAdvice = useCallback((newAdvice: Omit<Advice, 'id' | 'date'>) => addDocWithDate('advices', newAdvice), [user]);
  const addCategory = useCallback((newCategory: Omit<CustomCategory, 'id' | 'date'>) => addDocWithDate('categories', newCategory), [user]);

  const addFavorite = useCallback(async (categoryName: string) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/favorites`), {
      name: categoryName,
      date: new Date().toISOString()
    });
  }, [user]);

  const removeFavorite = useCallback(async (categoryName: string) => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/favorites`), where("name", "==", categoryName));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }, [user]);

  const removeIncome = useCallback((id: string) => deleteDocById('income', id), [user]);
  const removeExpense = useCallback((id: string) => deleteDocById('expenses', id), [user]);
  const removeGoal = useCallback((id: string) => deleteDocById('goals', id), [user]);
  const removeAdvice = useCallback((id: string) => deleteDocById('advices', id), [user]);
  const removeCategory = useCallback((id: string) => deleteDocById('categories', id), [user]);

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

  const favoriteCategories = useMemo(() => favorites.map(f => f.name), [favorites]);
  
  const totals = useMemo(() => {
    const totalIncome = income.reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalGoals = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSavedForGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const savings = totalIncome - totalExpenses;

    const totalNecessities = expenses
      .filter(e => necessityCategories.includes(e.category))
      .reduce((acc, e) => acc + e.amount, 0);

    const totalWants = expenses
      .filter(e => wantCategories.includes(e.category) || customCategories.some(c => c.name === e.category))
      .reduce((acc, e) => acc + e.amount, 0);

    return { 
        totalIncome, 
        totalExpenses, 
        savings, 
        totalGoals, 
        totalSavedForGoals,
        totalNecessities,
        totalWants
    };
  }, [income, expenses, goals, customCategories]);

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
    return monthlyPlanItems.filter(item => {
        const dueDate = new Date(item.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, next7Days);
    });
  }, [monthlyPlanItems]);

  const planningTotals = useMemo(() => {
    const plannedIncome = monthlyPlanItems
        .filter(item => item.type === 'ganho')
        .reduce((acc, item) => acc + item.amount, 0);
    
    const plannedExpenses = monthlyPlanItems
        .filter(item => item.type === 'gasto')
        .reduce((acc, item) => acc + item.amount, 0);
        
    const expectedSurplus = plannedIncome - plannedExpenses;

    return {
        plannedExpenses,
        plannedIncome,
        expectedSurplus
    }
  }, [monthlyPlanItems]);

  return {
    income,
    expenses,
    monthlyPlanItems,
    goals,
    advices,
    customCategories,
    favoriteCategories,
    addIncome,
    addExpense,
    addPlanItem,
    updatePlanItemStatus,
    removePlanItem,
    addGoal,
    addAdvice,
    addCategory,
    addFavorite,
    removeFavorite,
    removeIncome,
    removeExpense,
    removeGoal,
    removeAdvice,
    removeCategory,
    updateGoalContribution,
    totals,
    expensesByCategory,
    upcomingPayments,
    planningTotals,
    isClient,
    currentMonth,
    setCurrentMonth
  };
};
