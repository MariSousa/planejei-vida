'use client';

import React from 'react';
import Joyride, { type Step } from 'react-joyride';

interface InteractiveTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

export function InteractiveTour({ run, setRun }: InteractiveTourProps) {
  const steps: Step[] = [
    {
      target: '#tour-step-1',
      content: 'Aqui você tem uma visão geral da sua saúde financeira. O medidor mostra se suas finanças estão saudáveis, em atenção ou em estado crítico.',
      title: 'Saúde Financeira',
      placement: 'bottom',
    },
    {
      target: '#tour-step-2',
      content: 'Estes cards mostram um resumo rápido do seu mês: seu saldo, gastos, dívidas e investimentos.',
      title: 'Resumo Mensal',
       placement: 'bottom',
    },
    {
      target: '#tour-step-3',
      content: 'Acompanhe o progresso dos seus sonhos e metas financeiras. Ver o quão perto você está te mantém motivado!',
      title: 'Suas Metas',
       placement: 'top',
    },
    {
      target: '#tour-step-4',
      content: 'Veja suas últimas transações aqui. É um jeito rápido de conferir seus lançamentos mais recentes.',
      title: 'Atividade Recente',
       placement: 'top',
    },
  ];

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      callback={(data) => {
        if (data.status === 'finished' || data.status === 'skipped') {
          setRun(false);
        }
      }}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
      styles={{
        options: {
          arrowColor: 'hsl(var(--background))',
          backgroundColor: 'hsl(var(--background))',
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          zIndex: 1000,
        },
        tooltip: {
            borderRadius: 'var(--radius)',
        },
        buttonNext: {
            borderRadius: 'var(--radius)',
        },
        buttonBack: {
            borderRadius: 'var(--radius)',
        }
      }}
    />
  );
}
