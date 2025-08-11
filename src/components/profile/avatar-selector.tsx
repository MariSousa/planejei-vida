
'use client';

import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

const iconCategories = {
  'Animais & Natureza': [
    'Bird', 'Bone', 'Bug', 'Cat', 'Dog', 'Egg', 'Fish', 'FishSymbol', 'LeafyGreen',
    'Origami', 'Panda', 'PawPrint', 'Rabbit', 'Rat', 'Shell', 'Shrimp', 'Snail',
    'Squirrel', 'Turtle', 'Worm'
  ],
  'Expressões & Símbolos': [
    'Angry', 'Annoyed', 'BicepsFlexed', 'Frown', 'HandFist', 'HandHelping', 'HandMetal',
    'Heart', 'HeartCrack', 'HeartHandshake', 'Laugh', 'Meh', 'PartyPopper', 'Ribbon',
    'Salad', 'Smile', 'SmilePlus', 'Star', 'ThumbsDown', 'ThumbsUp'
  ],
  'Finanças & Dinheiro': [
    'BadgeCent', 'BadgeDollarSign', 'BadgeEuro', 'BadgeIndianRupee', 'BadgeJapaneseYen',
    'BadgePercent', 'BadgePoundSterling', 'BadgeRussianRuble', 'BadgeSwissFranc',
    'Banknote', 'Bitcoin', 'CircleDollarSign', 'CreditCard', 'Currency',
    'DiamondPercent', 'DollarSign', 'Euro', 'Gem', 'HandCoins', 'Handshake',
    'IndianRupee', 'JapaneseYen', 'Landmark', 'PiggyBank', 'PoundSterling', 'Receipt',
    'Wallet', 'WalletCards'
  ]
};

// A mapping from the string name to the actual icon component
const iconComponentMap = LucideIcons as Record<string, React.ElementType>;

export function AvatarSelector() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectIcon = async () => {
    if (!user || !selectedIcon) return;
    setIsLoading(true);
    try {
      await updateUserProfile({ photoURL: selectedIcon });
      toast({
        title: 'Avatar Atualizado!',
        description: 'Sua nova foto de perfil foi salva.',
        className: 'border-accent'
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar seu novo avatar.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
        setSelectedIcon(user?.photoURL || '');
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Alterar Avatar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Escolha seu Avatar</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={Object.keys(iconCategories)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(iconCategories).map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(iconCategories).map(([category, icons]) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-72">
                <div className="grid grid-cols-6 gap-4 p-4">
                  {icons.map(iconName => {
                    const IconComponent = iconComponentMap[iconName];
                    if (!IconComponent) return null;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setSelectedIcon(iconName)}
                        className={`flex items-center justify-center p-3 rounded-md border-2 transition-colors
                          ${selectedIcon === iconName ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-accent/50'}`}
                      >
                        <IconComponent className="w-8 h-8" />
                        <span className="sr-only">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSelectIcon} disabled={isLoading || !selectedIcon}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Avatar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
