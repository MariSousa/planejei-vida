
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export function AvatarSelector() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
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
        <p>Funcionalidade de ícones desabilitada para depuração.</p>
        <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button disabled={true}>
                Salvar Avatar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
