
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { explainInvestment } from '@/ai/flows/investment-explainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  question: z.string().min(10, { message: 'Por favor, faça uma pergunta com pelo menos 10 caracteres.' }),
});

export function InvestmentAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await explainInvestment(values);
      setExplanation(result.explanation);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao consultar a IA. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          Fale com o FinMentor
        </CardTitle>
        <CardDescription>
          Tem alguma dúvida sobre investimentos? Pergunte ao nosso assistente de IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua Pergunta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Qual a diferença entre LCI e LCA? O que é liquidez?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Pensando...' : 'Perguntar ao FinMentor'}
            </Button>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-6 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )}

        {error && (
            <div className="mt-6 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
            </div>
        )}

        {explanation && (
            <div className="mt-6 whitespace-pre-wrap text-sm text-foreground/90 p-4 bg-accent/10 rounded-md border border-accent/20">
                {explanation}
            </div>
        )}
      </CardContent>
    </Card>
  );
}

