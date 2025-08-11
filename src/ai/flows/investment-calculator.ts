
'use server';

/**
 * @fileOverview A server-side investment calculator flow.
 *
 * - calculateInvestment - Calculates the future value of an investment.
 * - InvestmentInput - The input type for the calculation.
 * - SimulationResult - The return type for the calculation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentInputSchema = z.object({
  initialAmount: z.number().describe('O valor inicial do investimento.'),
  monthlyContribution: z.number().describe('O valor do aporte mensal.'),
  yieldRate: z.number().describe('A taxa de rendimento como um percentual do CDI (ex: 100 para 100% do CDI).'),
  periodInMonths: z.number().int().describe('O prazo do investimento em meses.'),
});
export type InvestmentInput = z.infer<typeof InvestmentInputSchema>;

const SimulationResultSchema = z.object({
  totalInvested: z.number().describe('O valor total aportado pelo usuário.'),
  netYield: z.number().describe('O rendimento líquido total após a dedução do Imposto de Renda.'),
  finalAmount: z.number().describe('O montante final acumulado (Total Investido + Rendimento Líquido).'),
  details: z.object({
      grossYield: z.number(),
      irRate: z.number(),
      irValue: z.number(),
  })
});
export type SimulationResult = z.infer<typeof SimulationResultSchema>;

export async function calculateInvestment(input: InvestmentInput): Promise<SimulationResult> {
  return investmentCalculatorFlow(input);
}


// This is the core calculation logic, kept separate from the flow definition
// for clarity and potential reuse.
const runCalculation = (input: InvestmentInput): SimulationResult => {
    const { initialAmount, monthlyContribution, yieldRate, periodInMonths } = input;
    
    // Using a constant CDI rate for simulation, as discussed.
    // In a production app, this would be fetched from a reliable source.
    const MOCK_CDI_RATE_ANNUAL = 0.105; // 10.5%
    
    const effectiveAnnualRate = MOCK_CDI_RATE_ANNUAL * (yieldRate / 100);
    const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;

    let totalAmount = initialAmount;
    let totalInvested = initialAmount;
    
    for (let month = 1; month <= periodInMonths; month++) {
      if (month > 1) {
        totalAmount += monthlyContribution;
        totalInvested += monthlyContribution;
      }
      
      const interestOfMonth = totalAmount * monthlyRate;
      totalAmount += interestOfMonth;
    }

    const getIrRate = (days: number): number => {
        if (days <= 180) return 0.225; // 22.5%
        if (days <= 360) return 0.20; // 20%
        if (days <= 720) return 0.175; // 17.5%
        return 0.150; // A alíquota mínima é 15%
    };

    const grossYield = totalAmount - totalInvested;
    const daysInvested = periodInMonths * 30; // Approximation for tax calculation
    const irRate = getIrRate(daysInvested);
    const irValue = grossYield > 0 ? grossYield * irRate : 0;
    const netYield = grossYield - irValue;
    const finalAmount = totalInvested + netYield;

    return {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        netYield: parseFloat(netYield.toFixed(2)),
        finalAmount: parseFloat(finalAmount.toFixed(2)),
        details: {
            grossYield: parseFloat(grossYield.toFixed(2)),
            irRate,
            irValue: parseFloat(irValue.toFixed(2)),
        }
    };
};


const investmentCalculatorFlow = ai.defineFlow(
  {
    name: 'investmentCalculatorFlow',
    inputSchema: InvestmentInputSchema,
    outputSchema: SimulationResultSchema,
  },
  async (input) => {
    // Here we could add more complex logic, like fetching real-time CDI rates,
    // consulting other services, or logging the simulation event.
    // For now, we directly call our calculation logic.
    
    const result = runCalculation(input);
    
    return result;
  }
);
