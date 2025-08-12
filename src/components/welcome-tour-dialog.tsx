
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WelcomeTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeTourDialog({ open, onOpenChange }: WelcomeTourDialogProps) {
  const { toast } = useToast();

  const handleStartTour = () => {
    onOpenChange(false);
    toast({
      title: 'Funcionalidade em Breve!',
      description: 'O tour interativo ainda está em desenvolvimento.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Bem-vindo(a) ao Planejei!</DialogTitle>
          <DialogDescription className="text-center">
            Vimos que você é novo por aqui. Gostaria de fazer um tour rápido para conhecer as principais funcionalidades do aplicativo?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Não, obrigado
          </Button>
          <Button type="button" onClick={handleStartTour}>
            Sim, fazer tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
