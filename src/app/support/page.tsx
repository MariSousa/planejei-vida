
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { Loader2, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendSupportTicket } from './actions';
import Link from 'next/link';

const faqItems = [
    {
        question: "Como o Planejei funciona?",
        answer: "O Planejei é uma ferramenta de planejamento financeiro pessoal. Você cadastra seus ganhos, gastos, metas e investimentos, e o aplicativo te ajuda a visualizar sua vida financeira, oferecendo insights e conselhos para você tomar as melhores decisões."
    },
    {
        question: "Meus dados financeiros estão seguros?",
        answer: "Sim, a segurança dos seus dados é nossa maior prioridade. Todas as informações são criptografadas e armazenadas de forma segura. Nunca compartilhamos seus dados com terceiros."
    },
    {
        question: "Como posso deletar minha conta e meus dados?",
        answer: "Você pode deletar sua conta a qualquer momento na página 'Meu Perfil'. Ao fazer isso, todos os seus dados serão permanentemente apagados dos nossos servidores, sem possibilidade de recuperação. Antes de confirmar, você terá a opção de baixar um relatório completo com todas as suas informações."
    }
];

const formSchema = z.object({
  subject: z.string().min(5, { message: 'O assunto deve ter pelo menos 5 caracteres.' }),
  message: z.string().min(20, { message: 'A mensagem deve ter pelo menos 20 caracteres.' }),
});

function SupportPageContent() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: '',
            message: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !user.email) return;

        setIsLoading(true);
        const result = await sendSupportTicket({
            ...values,
            userEmail: user.email,
            userId: user.uid,
        });

        if (result.error) {
            toast({
                title: 'Erro ao Enviar',
                description: result.error,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Mensagem Enviada!',
                description: 'Recebemos sua solicitação. Nossa equipe de suporte responderá em seu e-mail o mais breve possível.',
                className: 'border-accent',
            });
            form.reset();
        }
        setIsLoading(false);
    }

    return (
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Central de Ajuda e Suporte</h1>
                    <p className="text-muted-foreground mt-2">
                        Precisa de ajuda? Tire suas dúvidas ou entre em contato com nossa equipe.
                    </p>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Canais Rápidos</CardTitle>
                        <CardDescription>
                            Para um contato mais direto, utilize um dos canais abaixo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className="w-full">
                            <Link href="https://wa.me/5521975775053" target="_blank">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                WhatsApp
                            </Link>
                        </Button>
                         <Button asChild variant="outline" className="w-full">
                            <Link href="mailto:sousaessens@gmail.com">
                                <Mail className="mr-2 h-4 w-4" />
                                E-mail
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent>{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Fale Conosco</CardTitle>
                    <CardDescription>
                        Se não encontrou a resposta que procurava, envie-nos uma mensagem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="support-name">Seu Nome</FormLabel>
                                    <Input id="support-name" value={user?.displayName || ''} disabled />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="support-email">Seu E-mail</FormLabel>
                                    <Input id="support-email" value={user?.email || ''} disabled />
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assunto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Dúvida sobre investimentos" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sua Mensagem</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Descreva sua dúvida ou problema em detalhes..." className="min-h-[150px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar Mensagem
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SupportPage() {
    return (
        <PrivateRoute>
            <SupportPageContent />
        </PrivateRoute>
    );
}
