
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Plus, X } from 'lucide-react';
import type { MonthlyPlanItem } from '@/types';
import { useState } from 'react';

interface PlannedItemSuggestionProps {
  item: Omit<MonthlyPlanItem, 'dueDate' | 'priority' | 'status' | 'type'> & { type?: 'ganho' | 'gasto' | undefined };
  onAdd: () => void;
  suggestionType: 'plan' | 'debt';
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function PlannedItemSuggestion({ item, onAdd, suggestionType }: PlannedItemSuggestionProps) {
  const [ignored, setIgnored] = useState(false);

  const handleAdd = () => {
    onAdd();
    setIgnored(true); // Effectively hide it after adding
  };
  
  const handleIgnore = () => {
      setIgnored(true);
  }

  if (ignored) {
      return null;
  }

  const suggestionText = suggestionType === 'debt' 
    ? <>Você tem um pagamento de <strong>{item.name}</strong> no valor de <strong>{formatCurrency(item.amount)}</strong> para este mês.</>
    : <>Você planejou um {item.type} de <strong>{item.name}</strong> no valor de <strong>{formatCurrency(item.amount)}</strong>.</>;

  const buttonText = suggestionType === 'debt' ? "Pagar este mês" : "Adicionar";

  return (
    <div className="p-3 rounded-lg border bg-accent/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            <div>
                <p className="text-sm font-medium">Lançamento Sugerido</p>
                <p className="text-sm text-muted-foreground">
                   {suggestionText}
                </p>
            </div>
        </div>
        <div className="flex gap-2 self-end sm:self-center">
            <Button size="sm" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                {buttonText}
            </Button>
             <Button size="sm" variant="ghost" onClick={handleIgnore}>
                <X className="mr-2 h-4 w-4" />
                Ignorar
            </Button>
        </div>
    </div>
  );
}
