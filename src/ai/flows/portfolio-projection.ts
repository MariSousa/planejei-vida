
'use server';

/**
 * @fileOverview A server-side portfolio projection flow.
 *
 * - projectPortfolio - Calculates the future value of a list of investments.
 * - PortfolioInput - The input type for the calculation.
 * - PortfolioProjectionResult - The return type for the calculation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Investment } from '@/types';

const InvestmentSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  institution: z.string(),
  amount: z.number(),
  yieldRate: z.number(),
  date: z.string(),
});

const PortfolioInputSchema = z.array(InvestmentSchema);

export type PortfolioInput = z.infer<typeof PortfolioInputSchema>;

const ProjectionPointSchema = z.object({
    years: z.number(),
    totalInvested: z.number(),
    netYield: z.number(),
    finalAmount: z.number(),
});

const PortfolioProjectionResultSchema = z.object({
  projections: z.array(ProjectionPointSchema),
});
export type PortfolioProjectionResult = z.infer<typeof PortfolioProjectionResultSchema>;


export async function projectPortfolio(input: PortfolioInput): Promise<PortfolioProjectionResult> {
  return portfolioProjectionFlow(input);
}

// This is the core calculation logic, adapted from the investment-calculator flow.
const runPortfolioCalculation = (investments: Investment[]): PortfolioProjectionResult => {
    const MOCK_CDI_RATE_ANNUAL = 0.105; // 10.5%
    const projectionYears = [1, 5, 10];

    const getIrRate = (days: number): number => {
        if (days <= 180) return 0.225;
        if (days <= 360) return 0.20;
        if (days <= 720) return 0.175;
        return 0.150;
    };

    const projections = projectionYears.map(years => {
        let finalAmount = 0;
        let totalInvested = 0;

        investments.forEach(investment => {
            const { amount, yieldRate } = investment;
            totalInvested += amount;

            const effectiveAnnualRate = MOCK_CDI_RATE_ANNUAL * (yieldRate / 100);
            
            // Simplified future value calculation for a lump sum
            const futureValue = amount * Math.pow((1 + effectiveAnnualRate), years);
            
            const grossYield = futureValue - amount;
            const daysInvested = years * 365;
            const irRate = getIrRate(daysInvested);
            const irValue = grossYield > 0 ? grossYield * irRate : 0;
            const netYield = grossYield - irValue;
            
            finalAmount += amount + netYield;
        });
        
        const totalNetYield = finalAmount - totalInvested;

        return {
            years,
            totalInvested: parseFloat(totalInvested.toFixed(2)),
            netYield: parseFloat(totalNetYield.toFixed(2)),
            finalAmount: parseFloat(finalAmount.toFixed(2)),
        };
    });

    return { projections };
};


const portfolioProjectionFlow = ai.defineFlow(
  {
    name: 'portfolioProjectionFlow',
    inputSchema: PortfolioInputSchema,
    outputSchema: PortfolioProjectionResultSchema,
  },
  async (investments) => {
    // This flow directly calls the calculation logic without involving a generative model.
    // It's a "rule-based" system, as discussed.
    const result = runPortfolioCalculation(investments);
    return result;
  }
);
