
'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as icons from 'lucide-react';

const iconGroups = [
  {
    name: 'Animais',
    icons: ['Bird', 'Bone', 'Bug', 'Cat', 'Dog', 'Egg', 'Fish', 'FishSymbol', 'Origami', 'Panda', 'PawPrint', 'Rabbit', 'Rat', 'Shell', 'Shrimp', 'Snail', 'Squirrel', 'Turtle', 'Worm']
  },
  {
    name: 'Símbolos e Emojis',
    icons: ['Angry', 'Annoyed', 'BicepsFlexed', 'Frown', 'HandFist', 'HandHelping', 'HandMetal', 'Heart', 'HeartCrack', 'HeartHandshake', 'Laugh', 'Leaf', 'Meh', 'PartyPopper', 'Ribbon', 'Salad', 'Smile', 'SmilePlus', 'Star', 'ThumbsDown', 'ThumbsUp']
  },
  {
    name: 'Finanças e Negócios',
    icons: ['BadgeCent', 'BadgeDollarSign', 'BadgeEuro', 'BadgeIndianRupee', 'BadgeJapaneseYen', 'BadgePercent', 'BadgePoundSterling', 'BadgeSwissFranc', 'Banknote', 'Bitcoin', 'CandlestickChart', 'CircleDollarSign', 'CreditCard', 'Currency', 'DiamondPercent', 'DollarSign', 'Euro', 'Gem', 'HandCoins', 'Landmark', 'Nfc', 'Percent', 'PiggyBank', 'PoundSterling', 'Receipt', 'ReceiptText', 'SmartphoneNfc', 'SquarePercent', 'Wallet', 'WalletCards']
  }
];

// Fallback in case an icon name is not found in lucide-react
const FallbackIcon = icons.HelpCircle;

export function AvatarSelector() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const currentIcon = useMemo(() => {
    return user?.photoURL?.startsWith('icon:') ? user.photoURL.split(':')[1] : null;
  }, [user?.photoURL]);

  React.useEffect(() => {
    if (open) {
      setSelectedIcon(currentIcon);
    }
  }, [open, currentIcon]);

  const handleSave = async () => {
    if (!selectedIcon) return;

    setIsLoading(true);
    try {
      await updateUserProfile({ photoURL: `icon:${selectedIcon}` });
      toast({
        title: 'Avatar Atualizado!',
        description: 'Seu novo avatar foi salvo com sucesso.',
        className: 'border-accent'
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o seu novo avatar.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Alterar Avatar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Escolha seu Avatar</DialogTitle>
          <DialogDescription>
            Selecione um ícone para personalizar seu perfil. Clique em Salvar para aplicar a mudança.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={iconGroups[0].name} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {iconGroups.map(group => (
              <TabsTrigger key={group.name} value={group.name}>{group.name}</TabsTrigger>
            ))}
          </TabsList>

          {iconGroups.map(group => (
            <TabsContent key={group.name} value={group.name}>
              <ScrollArea className="h-64">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-4">
                  {group.icons.map(iconName => {
                    // @ts-expect-error
                    const IconComponent = icons[iconName] || FallbackIcon;
                    return (
                      <Button
                        key={iconName}
                        variant="outline"
                        size="icon"
                        className={cn(
                          'w-14 h-14',
                          selectedIcon === iconName && 'ring-2 ring-primary border-primary'
                        )}
                        onClick={() => setSelectedIcon(iconName)}
                      >
                        <IconComponent className="h-8 w-8" />
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isLoading || !selectedIcon}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
