'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PiggyBank, Landmark, BarChart2, Globe, Bitcoin, Gem } from 'lucide-react';

const investmentGroups = [
    {
        label: 'Renda Fixa',
        icon: Landmark,
        options: ['Tesouro Selic', 'Tesouro Prefixado', 'Tesouro IPCA+', 'CDB', 'LCI', 'LCA', 'Debêntures', 'CRI', 'CRA', 'Notas Promissórias', 'Fundos de Renda Fixa', 'Poupança']
    },
    {
        label: 'Renda Variável',
        icon: BarChart2,
        options: ['Ações', 'Fundos de Ações', 'ETFs', 'BDRs', 'Fundos Imobiliários (FIIs)', 'Opções', 'Contratos Futuros']
    },
    {
        label: 'Fundos de Investimento',
        icon: PiggyBank,
        options: ['Fundos Multimercado', 'Fundos Cambiais', 'Fundos de Previdência Privada', 'Fundos de Crédito Privado']
    },
    {
        label: 'Criptoativos',
        icon: Bitcoin,
        options: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Stablecoins', 'Altcoins']
    },
    {
        label: 'Alternativos',
        icon: Gem,
        options: ['Crowdfunding Imobiliário', 'Peer-to-peer lending', 'Arte e Colecionáveis']
    }
];


interface InvestmentSelectorProps {
  onSelect: (investmentType: string) => void;
  selectedValue?: string;
}

export function InvestmentSelector({ onSelect, selectedValue }: InvestmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(investmentGroups[0].label);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return investmentGroups;
    
    return investmentGroups.map(group => {
      const filteredOptions = group.options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredOptions.length > 0) {
        return { ...group, options: filteredOptions };
      }
      return null;
    }).filter(Boolean) as typeof investmentGroups;
  }, [searchTerm]);

  const activeGroup = useMemo(() => {
      if (!selectedGroup) return null;
      return investmentGroups.find(g => g.label === selectedGroup) || null;
  }, [selectedGroup]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-2 min-h-[300px]">
        {/* Left Panel: Main Groups */}
        <div className="flex flex-col">
        <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
            placeholder="Buscar Tipos" 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <ScrollArea className="flex-grow h-[260px]">
            <div className="pr-2">
            {filteredGroups.map(group => {
                const Icon = group.icon;
                return (
                <button
                    key={group.label}
                    type="button"
                    onClick={() => setSelectedGroup(group.label)}
                    className={cn(
                    "w-full flex items-center justify-between p-2 text-sm rounded-md text-left",
                    selectedGroup === group.label ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    )}
                >
                    <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span>{group.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                </button>
                )
            })}
            </div>
        </ScrollArea>
        </div>

        {/* Right Panel: Subcategories */}
        <div className="border-l pl-2">
        <ScrollArea className="h-full max-h-[300px]">
            <div className="pr-2">
                {activeGroup ? (
                    <>
                        <h3 className="font-semibold mb-2 p-2">{activeGroup.label}</h3>
                        {activeGroup.options.map(option => {
                            return (
                                <div key={option} className="flex items-center group/item">
                                    <Button
                                        type="button"
                                        variant={selectedValue === option ? 'default' : 'ghost'}
                                        className="w-full justify-start gap-2"
                                        onClick={() => onSelect(option)}
                                    >
                                        {option}
                                    </Button>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        <p>Selecione um grupo à esquerda</p>
                    </div>
                )}
            </div>
        </ScrollArea>
        </div>
    </div>
  );
}
