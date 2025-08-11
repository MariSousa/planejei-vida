
'use client';

import { useAuth } from '@/contexts/auth-context';
import { PrivateRoute } from '@/components/private-route';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AvatarSelector } from '@/components/profile/avatar-selector';
import { UserAvatar } from '@/components/user-avatar';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
});

const passwordFormSchema = z.object({
  newPassword: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
});

function ProfilePageContent() {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    setIsProfileLoading(true);
    try {
        await updateUserProfile({ displayName: values.displayName });
        toast({
            title: 'Perfil Atualizado!',
            description: 'Seu nome foi alterado com sucesso.',
            className: 'border-accent'
        });
    } catch (error: any) {
        toast({
            title: 'Erro ao Atualizar',
            description: error.message || 'Não foi possível atualizar seu perfil.',
            variant: 'destructive',
        });
    } finally {
        setIsProfileLoading(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsPasswordLoading(true);
     try {
        await updateUserPassword(values.newPassword);
        toast({
            title: 'Senha Alterada!',
            description: 'Sua senha foi alterada com sucesso.',
            className: 'border-accent'
        });
        passwordForm.reset();
    } catch (error: any) {
         toast({
            title: 'Erro ao Alterar Senha',
            description: 'Ocorreu um erro. Pode ser necessário fazer login novamente para alterar a senha.',
            variant: 'destructive',
        });
    } finally {
        setIsPasswordLoading(false);
    }
  }

  if (!user) {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[280px]" />
            <Skeleton className="h-[340px]" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Perfil Público</CardTitle>
                <CardDescription>
                Suas informações de perfil que serão visíveis para o aplicativo.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                    <UserAvatar
                        userName={user.displayName || user.email}
                        photoURL={user.photoURL}
                        className="w-24 h-24 text-3xl"
                    />
                    <AvatarSelector />
                </div>
                <div className="w-full">
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                            control={profileForm.control}
                            name="displayName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome de Exibição</FormLabel>
                                <FormControl>
                                <Input placeholder="Seu Nome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isProfileLoading}>
                            {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Nome
                        </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                <CardTitle>Informações de Login</CardTitle>
                <CardDescription>
                    Gerencie suas informações de acesso. Seu e-mail é: {user.email}
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">O e-mail não pode ser alterado.</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                    Para sua segurança, escolha uma senha forte.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPasswordLoading}>
                        {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Alterar Senha
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

export default function ProfilePage() {
    return (
        <PrivateRoute>
            <ProfilePageContent />
        </PrivateRoute>
    )
}
