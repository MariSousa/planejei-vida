import { Wallet } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
      <Wallet className="h-6 w-6 text-primary" />
      <span className="font-headline">Planejei</span>
    </div>
  );
}
