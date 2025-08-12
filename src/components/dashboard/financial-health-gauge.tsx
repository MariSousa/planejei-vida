
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialHealthGaugeProps {
  healthScore: number; // A score from 0 to 100
}

export function FinancialHealthGauge({ healthScore }: FinancialHealthGaugeProps) {
  const score = Math.max(0, Math.min(100, healthScore));
  const angle = (score / 100) * 180; // Map score (0-100) to angle (0-180)

  const getStatus = () => {
    if (score > 66) return { text: 'Saudável', color: 'text-green-500' };
    if (score > 33) return { text: 'Em Atenção', color: 'text-yellow-500' };
    return { text: 'Crítico', color: 'text-red-500' };
  };

  const status = getStatus();

  return (
      <Card className="flex flex-col items-center justify-center p-6 bg-card">
        <div className="relative w-48 h-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Background arc */}
            <svg width="192" height="96" viewBox="0 0 192 96" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-5))" />
                  <stop offset="50%" stopColor="hsl(var(--chart-3))" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                </linearGradient>
              </defs>
              <path
                d="M 16 96 A 80 80 0 0 1 176 96"
                stroke="url(#gaugeGradient)"
                strokeWidth="24"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 w-1 h-20 bg-foreground origin-bottom transition-transform duration-500 rounded-t-full"
            style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}
          >
                <div className="w-4 h-4 rounded-full bg-foreground absolute -top-2 -left-[6px] border-4 border-card" />
          </div>
        </div>
        <p className={`mt-2 text-lg font-bold ${status.color}`}>{status.text}</p>
        <p className="text-xs text-muted-foreground">Sua saúde financeira este mês</p>
      </Card>
  );
}
