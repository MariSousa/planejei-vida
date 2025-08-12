
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useFinancials } from '@/hooks/use-financials';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Landmark, Receipt, Target, Wallet, Star, PlusCircle } from 'lucide-react';
import { type Income, type Expense, type Goal, type Debt } from '@/types';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchableItem = 
  | (Income & { itemType: 'income' })
  | (Expense & { itemType: 'expense' })
  | (Goal & { itemType: 'goal' })
  | (Debt & { itemType: 'debt' });

type ActionItem = {
    id: string;
    itemType: 'action';
    name: string;
    path: string;
};

type FavoriteItem = {
    id: string;
    itemType: 'favorite';
    name: string;
    path: string;
};

type ResultItem = SearchableItem | ActionItem | FavoriteItem;


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const { income, expenses, goals, debts, favoriteCategories } = useFinancials();
  const [query, setQuery] = useState('');

  const allData = useMemo<SearchableItem[]>(() => [
    ...income.map(item => ({ ...item, itemType: 'income' as const })),
    ...expenses.map(item => ({ ...item, itemType: 'expense' as const })),
    ...goals.map(item => ({ ...item, itemType: 'goal' as const })),
    ...debts.map(item => ({ ...item, itemType: 'debt' as const })),
  ], [income, expenses, goals, debts]);

  const fuse = useMemo(() => new Fuse(allData, {
    keys: ['source', 'category', 'name', 'amount'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [allData]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange, open]);

  const handleSelect = (item: ResultItem) => {
    let path = '/';
    switch(item.itemType) {
        case 'income': path = '/income'; break;
        case 'expense': path = '/expenses'; break;
        case 'goal': path = '/goals'; break;
        case 'debt': path = '/debts'; break;
        case 'action':
        case 'favorite':
            path = item.path;
            break;
    }
    router.push(path);
    onOpenChange(false);
  };
  
  const initialSuggestions: (ActionItem | FavoriteItem)[] = useMemo(() => {
    const actions: ActionItem[] = [
      { id: 'action-add-expense', itemType: 'action', name: 'Adicionar Gasto', path: '/expenses' },
      { id: 'action-add-income', itemType: 'action', name: 'Adicionar Ganho', path: '/income' },
      { id: 'action-create-goal', itemType: 'action', name: 'Criar Meta', path: '/goals' },
      { id: 'action-add-debt', itemType: 'action', name: 'Registrar Compromisso', path: '/debts' },
    ];
    
    const favorites: FavoriteItem[] = favoriteCategories.map(fav => ({
        id: `fav-${fav}`,
        itemType: 'favorite',
        name: `Adicionar Gasto: ${fav}`,
        path: `/expenses?category=${encodeURIComponent(fav)}` // Example of pre-filling
    }));
    
    return [...favorites, ...actions];
  }, [favoriteCategories]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query, { limit: 10 }).map(res => res.item);
  }, [query, fuse]);

  const renderItem = (item: ResultItem) => {
    switch (item.itemType) {
        case 'income':
            return (
                <div className="flex w-full items-center justify-between">
                    <span>{item.source}</span>
                    <span className="text-green-500">{formatCurrency(item.amount)}</span>
                </div>
            );
        case 'expense':
            return (
                <div className="flex w-full items-center justify-between">
                    <span>{item.category}</span>
                    <span className="text-red-500">{formatCurrency(item.amount)}</span>
                </div>
            );
        case 'goal':
             return (
                <div className="flex w-full items-center justify-between">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.targetAmount)}</span>
                </div>
            );
        case 'debt':
             return (
                <div className="flex w-full items-center justify-between">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.remainingAmount)}</span>
                </div>
            );
        case 'action':
        case 'favorite':
            return <span className="w-full">{item.name}</span>;
        default: return null;
    }
  }

  const getIcon = (type: ResultItem['itemType']) => {
    switch(type) {
        case 'income': return <Wallet className="mr-2 h-4 w-4" />;
        case 'expense': return <Receipt className="mr-2 h-4 w-4" />;
        case 'goal': return <Target className="mr-2 h-4 w-4" />;
        case 'debt': return <Landmark className="mr-2 h-4 w-4" />;
        case 'action': return <PlusCircle className="mr-2 h-4 w-4" />;
        case 'favorite': return <Star className="mr-2 h-4 w-4" />;
        default: return null;
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Pesquisar ou executar uma ação..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        {!query && initialSuggestions.length > 0 && (
             <CommandGroup heading="Sugestões">
                {initialSuggestions.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)} value={item.id}>
                    {getIcon(item.itemType)}
                    {renderItem(item)}
                </CommandItem>
                ))}
            </CommandGroup>
        )}

        {query && results.length > 0 && (
          <CommandGroup heading="Resultados da Busca">
            {results.map((item) => (
              <CommandItem key={item.id} onSelect={() => handleSelect(item)} value={item.id}>
                 {getIcon(item.itemType)}
                {renderItem(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
