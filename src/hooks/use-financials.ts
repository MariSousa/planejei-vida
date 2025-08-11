
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type Income, type Expense, type MonthlyPlanItem, type Goal, type Advice, type Contribution, type CustomCategory, type Favorite, type Priority, type Status, type PlanItemType, type Investment } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, runTransaction, where, getDocs, updateDoc, writeBatch, setDoc } from 'firebase/firestore';
import { addDays, isAfter, isBefore, startOfToday, format, addMonths } from 'date-fns';

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
  
  // States for main dashboard data (always current month)
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonthPlanItemsForSuggestions, setCurrentMonthPlanItemsForSuggestions] = useState<MonthlyPlanItem[]>([]);

  // States for planning page
  const [currentPlanningMonth, setCurrentPlanningMonth] = useState(addMonths(new Date(), 1));
  const [planningMonthItems, setPlanningMonthItems] = useState<MonthlyPlanItem[]>([]);

  // States for reports page
  const [reportMonth, setReportMonth] = useState(new Date());
  const [reportIncome, setReportIncome] = useState<Income[]>([]);
  const [reportExpenses, setReportExpenses] = useState<Expense[]>([]);
  const [reportMonthlyPlanItems, setReportMonthlyPlanItems] = useState<MonthlyPlanItem[]>([]);

  // States for non-monthly data
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    if (user) {
      // Listener for non-monthly data (goals, advices, categories, favorites)
      const collections = ['goals', 'advices', 'categories', 'favorites', 'investments'];
      const setters: any = {
        goals: setGoals,
        advices: setAdvices,
        categories: setCustomCategories,
        favorites: setFavorites,
        investments: setInvestments,
      };

      const unsubscribes = collections.map(col => {
        const q = query(collection(db, `users/${user.uid}/${col}`), orderBy('date', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setters[col](data);
        });
      });

      // Listener for current month's income (for dashboard)
      const currentMonthStr = format(new Date(), 'yyyy-MM');
      const incomeItemsCollectionRef = collection(db, `users/${user.uid}/income/${currentMonthStr}/items`);
      const incomeQuery = query(incomeItemsCollectionRef, orderBy('date', 'desc'));
      const unsubIncome = onSnapshot(incomeQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));
        setIncome(items);
      });

       // Listener for current month's expenses (for dashboard)
      const expensesItemsCollectionRef = collection(db, `users/${user.uid}/expenses/${currentMonthStr}/items`);
      const expensesQuery = query(expensesItemsCollectionRef, orderBy('date', 'desc'));
      const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
        setExpenses(items);
      });

      // Listener for the current month's plan to generate suggestions
      const currentPlanMonthStr = format(new Date(), 'yyyy-MM');
      const currentPlanItemsRef = collection(db, `users/${user.uid}/monthlyPlan/${currentPlanMonthStr}/items`);
      const currentPlanQuery = query(currentPlanItemsRef, orderBy('dueDate', 'asc'));
      const unsubCurrentPlan = onSnapshot(currentPlanQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyPlanItem));
        setCurrentMonthPlanItemsForSuggestions(items);
      });

      setIsClient(true);

      return () => {
        unsubscribes.forEach(unsub => unsub());
        unsubIncome();
        unsubExpenses();
        unsubCurrentPlan();
      };
    } else {
        setIncome([]);
        setExpenses([]);
        setPlanningMonthItems([]);
        setCurrentMonthPlanItemsForSuggestions([]);
        setGoals([]);
        setInvestments([]);
        setAdvices([]);
        setCustomCategories([]);
        setFavorites([]);
    }
  }, [user]);

  // Listener for planning month items
  useEffect(() => {
    if (user) {
      const monthStr = format(currentPlanningMonth, 'yyyy-MM');
      const itemsCollectionRef = collection(db, `users/${user.uid}/monthlyPlan/${monthStr}/items`);
      const q = query(itemsCollectionRef, orderBy('dueDate', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyPlanItem));
        setPlanningMonthItems(items);
      });
      
      return () => unsubscribe();
    }
  }, [user, currentPlanningMonth]);

  // Listener for report month data
  useEffect(() => {
    if (user) {
        const monthStr = format(reportMonth, 'yyyy-MM');
        
        // Fetch Income for report
        const reportIncomeRef = collection(db, `users/${user.uid}/income/${monthStr}/items`);
        const unsubReportIncome = onSnapshot(query(reportIncomeRef, orderBy('date', 'desc')), (snapshot) => {
            setReportIncome(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income)));
        });

        // Fetch Expenses for report
        const reportExpensesRef = collection(db, `users/${user.uid}/expenses/${monthStr}/items`);
        const unsubReportExpenses = onSnapshot(query(reportExpensesRef, orderBy('date', 'desc')), (snapshot) => {
            setReportExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
        });

        // Fetch Plan Items for report
        const reportPlanItemsRef = collection(db, `users/${user.uid}/monthlyPlan/${monthStr}/items`);
        const unsubReportPlanItems = onSnapshot(query(reportPlanItemsRef, orderBy('dueDate', 'asc')), (snapshot) => {
            setReportMonthlyPlanItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyPlanItem)));
        });

        return () => {
            unsubReportIncome();
            unsubReportExpenses();
            unsubReportPlanItems();
        };
    }
  }, [user, reportMonth]);


  const addMonthlyDocWithDate = async (collectionName: 'income' | 'expenses', data: any) => {
      if (!user) return;
      const date = new Date();
      const monthStr = format(date, 'yyyy-MM');
      const monthDocRef = doc(db, `users/${user.uid}/${collectionName}`, monthStr);
      await setDoc(monthDocRef, { month: monthStr }, { merge: true });

      const itemsCollectionRef = collection(monthDocRef, 'items');
      await addDoc(itemsCollectionRef, {
          ...data,
          date: date.toISOString()
      });
  }

  const deleteMonthlyDocById = async (collectionName: 'income' | 'expenses', id: string) => {
      if (!user) return;
      const date = new Date(); // Assuming we delete from the current month
      const monthStr = format(date, 'yyyy-MM');
      const itemRef = doc(db, `users/${user.uid}/${collectionName}/${monthStr}/items`, id);
      await deleteDoc(itemRef);
  }

  // Generic functions for collections not structured by month
  const addDocToCollection = async (collectionName: string, data: any) => {
      if (!user) return;
      await addDoc(collection(db, `users/${user.uid}/${collectionName}`), {
          ...data,
          date: new Date().toISOString()
      });
  }
  
  const deleteDocFromCollection = async (collectionName: string, id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, `users/${user.uid}/${collectionName}`, id));
  }

  const addIncome = useCallback((newIncome: Omit<Income, 'id' | 'date'>) => addMonthlyDocWithDate('income', newIncome), [user]);
  const addExpense = useCallback((newExpense: Omit<Expense, 'id' | 'date'>) => addMonthlyDocWithDate('expenses', newExpense), [user]);
  
  const addPlanItem = useCallback(async (item: Omit<MonthlyPlanItem, 'id' | 'status'>) => {
    if (!user) return;
    const monthStr = format(currentPlanningMonth, 'yyyy-MM');
    const monthDocRef = doc(db, `users/${user.uid}/monthlyPlan`, monthStr);
    await setDoc(monthDocRef, { month: monthStr }, { merge: true }); 

    const itemsCollectionRef = collection(monthDocRef, 'items');
    await addDoc(itemsCollectionRef, {
        ...item,
        status: 'Previsto' as Status
    });
  }, [user, currentPlanningMonth]);

  const updatePlanItemStatus = useCallback(async (id: string, status: Status) => {
    if (!user) return;
    const monthStr = format(currentPlanningMonth, 'yyyy-MM');
    const itemRef = doc(db, `users/${user.uid}/monthlyPlan/${monthStr}/items`, id);
    await updateDoc(itemRef, { status });
  }, [user, currentPlanningMonth]);

  const removePlanItem = useCallback((id: string) => {
    if (!user) return;
    const monthStr = format(currentPlanningMonth, 'yyyy-MM');
    const itemRef = doc(db, `users/${user.uid}/monthlyPlan/${monthStr}/items`, id);
    return deleteDoc(itemRef);
  }, [user, currentPlanningMonth]);

  const addGoal = useCallback((newGoal: Omit<Goal, 'id' | 'date'>) => addDocToCollection('goals', newGoal), [user]);
  const addInvestment = useCallback((newInvestment: Omit<Investment, 'id' | 'date'>) => addDocToCollection('investments', newInvestment), [user]);
  const updateInvestment = useCallback(async (id: string, data: Partial<Omit<Investment, 'id' | 'date'>>) => {
    if (!user) return;
    const investmentRef = doc(db, `users/${user.uid}/investments`, id);
    await updateDoc(investmentRef, data);
  }, [user]);

  const addAdvice = useCallback((newAdvice: Omit<Advice, 'id' | 'date'>) => addDocToCollection('advices', newAdvice), [user]);
  const addCategory = useCallback((newCategory: Omit<CustomCategory, 'id' | 'date'>) => addDocToCollection('categories', newCategory), [user]);

  const addFavorite = useCallback(async (categoryName: string) => {
    if (!user) return;
    await addDocToCollection('favorites', { name: categoryName });
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

  const removeIncome = useCallback((id: string) => deleteMonthlyDocById('income', id), [user]);
  const removeExpense = useCallback((id: string) => deleteMonthlyDocById('expenses', id), [user]);
  const removeGoal = useCallback((id: string) => deleteDocFromCollection('goals', id), [user]);
  const removeInvestment = useCallback((id: string) => deleteDocFromCollection('investments', id), [user]);
  const removeAdvice = useCallback((id: string) => deleteDocFromCollection('advices', id), [user]);
  const removeCategory = useCallback((id: string) => deleteDocFromCollection('categories', id), [user]);

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
    return currentMonthPlanItemsForSuggestions.filter(item => {
        if (item.type !== 'gasto' || item.status !== 'Previsto') return false;
        const dueDate = new Date(item.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, next7Days);
    });
  }, [currentMonthPlanItemsForSuggestions]);

  const planningTotals = useMemo(() => {
    const plannedIncome = planningMonthItems
        .filter(item => item.type === 'ganho')
        .reduce((acc, item) => acc + item.amount, 0);
    
    const plannedExpenses = planningMonthItems
        .filter(item => item.type === 'gasto')
        .reduce((acc, item) => acc + item.amount, 0);
        
    const expectedSurplus = plannedIncome - plannedExpenses;

    return {
        plannedExpenses,
        plannedIncome,
        expectedSurplus
    }
  }, [planningMonthItems]);

  const pendingPlannedIncome = useMemo(() => {
    const normalize = (str: string) => str.trim().toLowerCase();
    const planned = currentMonthPlanItemsForSuggestions.filter(p => p.type === 'ganho' && p.status === 'Previsto');
    const actualSources = income.map(i => normalize(i.source));
    return planned.filter(p => !actualSources.includes(normalize(p.name)));
  }, [currentMonthPlanItemsForSuggestions, income]);

  const pendingPlannedExpenses = useMemo(() => {
      const normalize = (str: string) => str.trim().toLowerCase();
      const planned = currentMonthPlanItemsForSuggestions.filter(p => p.type === 'gasto' && p.status === 'Previsto');
      const actualCategories = expenses.map(e => normalize(e.category));
      return planned.filter(p => !actualCategories.includes(normalize(p.name)));
  }, [currentMonthPlanItemsForSuggestions, expenses]);

  return {
    income,
    expenses,
    planningMonthItems,
    goals,
    investments,
    advices,
    customCategories,
    favoriteCategories,
    pendingPlannedIncome,
    pendingPlannedExpenses,
    reportIncome,
    reportExpenses,
    reportMonthlyPlanItems,
    addIncome,
    addExpense,
    addPlanItem,
    updatePlanItemStatus,
    removePlanItem,
    addGoal,
    addInvestment,
    updateInvestment,
    addAdvice,
    addCategory,
    addFavorite,
    removeFavorite,
    removeIncome,
    removeExpense,
    removeGoal,
    removeInvestment,
    removeAdvice,
    removeCategory,
    updateGoalContribution,
    totals,
    expensesByCategory,
    upcomingPayments,
    planningTotals,
    isClient,
    currentPlanningMonth,
    setCurrentPlanningMonth,
    reportMonth,
    setReportMonth,
  };
};
