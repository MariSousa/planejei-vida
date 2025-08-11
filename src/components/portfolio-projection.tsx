
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { type Investment } from '@/types';
import { projectPortfolio, type PortfolioProjectionResult } from '@/ai/flows/portfolio-projection';
import { cn } from '@/lib/utils';

interface PortfolioProjectionProps {
  investments: Investment[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function PortfolioProjection({ investments }: PortfolioProjectionProps) {
  const [result, setResult] = useState<PortfolioProjectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    const getProjection = async () => {
      if (investments.length === 0) {
        setIsLoading(false);
        setResult(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const projection = await projectPortfolio(investments);
        setResult(projection);
      } catch (e) {
        console.error(e);
        setError("Não foi possível calcular a projeção da sua carteira. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    getProjection();
  }, [investments]);

  if (investments.length === 0) {
    return null; // Don't show the component if there are no investments
  }
  
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48">
                     <Skeleton className="h-32 w-full" />
                </div>
            </CardContent>
        </Card>
    )
  }

  if (error) {
      return (
          <Card>
            <CardHeader>
                <CardTitle>Projeção da Carteira</CardTitle>
                <CardDescription>O crescimento estimado dos seus investimentos ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-destructive p-4 border border-destructive rounded-md bg-destructive/10">
                    {error}
                </div>
            </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção da Carteira</CardTitle>
        <CardDescription>O crescimento estimado dos seus investimentos ao longo do tempo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {result?.projections.map((p) => (
              <div key={p.years} className="flex-grow-0 flex-shrink-0 w-full min-w-0 pl-4">
                <div className="p-6 rounded-lg bg-muted flex flex-col items-center text-center">
                   <p className="text-sm font-medium text-muted-foreground">Em {p.years} {p.years > 1 ? 'anos' : 'ano'}, seu patrimônio pode ser</p>
                   <p className="text-4xl font-bold text-primary my-2">{formatCurrency(p.finalAmount)}</p>
                   <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{formatCurrency(p.netYield)} em rendimentos</span>
                   </div>
                   <p className="text-xs text-muted-foreground mt-1">A partir de {formatCurrency(p.totalInvested)} investidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={scrollPrev}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext}>
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
