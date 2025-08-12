
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useFinancials } from '@/hooks/use-financials';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Landmark, Receipt, Target, Wallet } from 'lucide-react';
import { type Income, type Expense, type Goal, type Debt } from '@/types';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchableItem = 
  | (Income & { type: 'income' })
  | (Expense & { type: 'expense' })
  | (Goal & { type: 'goal' })
  | (Debt & { type: 'debt' });

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const { income, expenses, goals, debts } = useFinancials();
  const [query, setQuery] = useState('');

  const allData = useMemo<SearchableItem[]>(() => [
    ...income.map(item => ({ ...item, type: 'income' as const })),
    ...expenses.map(item => ({ ...item, type: 'expense' as const })),
    ...goals.map(item => ({ ...item, type: 'goal' as const })),
    ...debts.map(item => ({ ...item, type: 'debt' as const })),
  ], [income, expenses, goals, debts]);

  const fuse = useMemo(() => new Fuse(allData, {
    keys: ['source', 'category', 'name', 'amount'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [allData]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query, { limit: 10 });
  }, [query, fuse]);

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

  const handleSelect = (item: SearchableItem) => {
    let path = '/';
    switch(item.type) {
        case 'income': path = '/income'; break;
        case 'expense': path = '/expenses'; break;
        case 'goal': path = '/goals'; break;
        case 'debt': path = '/debts'; break;
    }
    router.push(path);
    onOpenChange(false);
  };

  const renderItem = (item: SearchableItem) => {
    switch (item.type) {
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
        default: return null;
    }
  }

  const getIcon = (type: SearchableItem['type']) => {
    switch(type) {
        case 'income': return <Wallet className="mr-2 h-4 w-4" />;
        case 'expense': return <Receipt className="mr-2 h-4 w-4" />;
        case 'goal': return <Target className="mr-2 h-4 w-4" />;
        case 'debt': return <Landmark className="mr-2 h-4 w-4" />;
        default: return null;
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Pesquisar transações, metas ou compromissos..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="Resultados">
            {results.map(({ item }) => (
              <CommandItem key={item.id} onSelect={() => handleSelect(item)} value={item.id}>
                 {getIcon(item.type)}
                {renderItem(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
