
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

const resetPasswordSchema = z.object({
    resetEmail: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export default function LoginPage() {
  const { signUp, signIn, user, sendPasswordReset } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: '',
        password: '',
    },
  });
  
  const passwordValue = form.watch('password');

  const passwordRequirements = useMemo(() => {
    const value = passwordValue || '';
    return {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[^A-Za-z0-9]/.test(value),
    };
  }, [passwordValue]);

  const passwordStrength = useMemo(() => {
    const metRequirements = Object.values(passwordRequirements).filter(Boolean).length;
    return metRequirements;
  }, [passwordRequirements]);

  const areAllRequirementsMet = passwordStrength === 4;

  // Redirect if user is already logged in
  useEffect(() => {
    // We disable redirection in dev mode to allow testing login page
    // even with a mock user.
    if (process.env.NODE_ENV === 'development' && user?.uid === 'mock-user-id') {
      return;
    }
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(values.email, values.password);
      } else {
        if (!areAllRequirementsMet) {
             toast({
                title: 'Senha Inválida',
                description: 'Por favor, cumpra todos os requisitos da senha.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }
        await signUp(values.email, values.password);
        toast({
          title: 'Conta Criada!',
          description: 'Sua conta foi criada com sucesso. Você já pode fazer o login.',
          className: 'border-accent'
        });
        setIsLogin(true); // Switch to login view after successful signup
      }
    } catch (error: any) {
      let friendlyMessage = 'Ocorreu um erro. Tente novamente.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            friendlyMessage = 'E-mail ou senha inválidos.';
            break;
        case 'auth/email-already-in-use':
            friendlyMessage = 'Este e-mail já está em uso.';
            break;
        case 'auth/network-request-failed':
             friendlyMessage = 'Erro de rede ou configuração. Verifique se o método de login por Email/Senha está ativo no console do Firebase.';
             break;
        case 'auth/permission-denied':
            friendlyMessage = 'Permissão negada. A chave de API do Firebase pode ter sido suspensa. Verifique o console do Firebase.';
            break;
        default:
            console.error("Firebase Auth Error:", error);
            break;
      }
      
      toast({
        title: 'Erro',
        description: friendlyMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    setResetError('');
    const validation = resetPasswordSchema.safeParse({ resetEmail });
    if (!validation.success) {
        setResetError(validation.error.errors[0].message);
        return;
    }
    
    setIsLoading(true);
    try {
        await sendPasswordReset(resetEmail);
        toast({
            title: 'E-mail Enviado!',
            description: 'Verifique sua caixa de entrada para o link de redefinição de senha.',
            className: 'border-accent',
        });
        return true; // Indicate success to close dialog
    } catch (error: any) {
        let friendlyMessage = 'Não foi possível enviar o e-mail. Tente novamente.';
        if (error.code === 'auth/user-not-found') {
            friendlyMessage = 'Nenhuma conta encontrada com este e-mail.';
        }
        setResetError(friendlyMessage);
        return false; // Indicate failure
    } finally {
        setIsLoading(false);
    }
  };

  const Requirement = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
    <div className={cn("flex items-center gap-2 text-sm", met ? "text-green-600" : "text-muted-foreground")}>
      <CheckCircle2 className={cn("h-4 w-4 transition-colors", met ? "text-green-600" : "text-gray-400")} />
      <span>{children}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
               <Logo />
            </div>
          <CardTitle className="text-2xl">{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Entre com seu e-mail para acessar seu dashboard.' : 'Preencha os dados para começar a planejar.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                        <FormLabel>Senha</FormLabel>
                        {isLogin && (
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="link" className="p-0 h-auto text-xs">Esqueceu a senha?</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Redefinir sua senha</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Digite seu e-mail abaixo. Se houver uma conta associada, enviaremos um link para você redefinir sua senha.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-2">
                                        <Input
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                        />
                                        {resetError && <p className="text-sm text-destructive">{resetError}</p>}
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={async (e) => {
                                            const success = await handlePasswordReset();
                                            if (!success) e.preventDefault();
                                        }} disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Enviar Link
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isLogin && passwordValue && (
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                        <Progress 
                            value={passwordStrength * 25} 
                            className={cn(
                                "h-2 transition-all",
                                passwordStrength <= 1 && "[&>div]:bg-red-500",
                                passwordStrength === 2 && "[&>div]:bg-yellow-500",
                                passwordStrength >= 3 && "[&>div]:bg-green-500"
                            )}
                        />
                         <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                            {passwordStrength <= 1 && "Fraca"}
                            {passwordStrength === 2 && "Média"}
                            {passwordStrength >= 3 && "Forte"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        <Requirement met={passwordRequirements.length}>Mínimo 8 caracteres</Requirement>
                        <Requirement met={passwordRequirements.uppercase}>Uma letra maiúscula</Requirement>
                        <Requirement met={passwordRequirements.number}>Um número</Requirement>
                        <Requirement met={passwordRequirements.specialChar}>Um caractere especial</Requirement>
                    </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading || (!isLogin && !areAllRequirementsMet)}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <Button variant="link" className="pl-1" onClick={() => {
                form.reset();
                setIsLogin(!isLogin)
            }}>
              {isLogin ? 'Crie uma agora' : 'Faça o login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
