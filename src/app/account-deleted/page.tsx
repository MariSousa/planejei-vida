'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AccountDeletedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Conta Excluída com Sucesso</CardTitle>
          <CardDescription>
            Sua conta e todos os dados associados a ela foram permanentemente apagados dos nossos servidores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Agradecemos por ter feito parte da nossa comunidade. Se você mudar de ideia, pode sempre criar uma nova conta.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/login">Voltar para o Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
