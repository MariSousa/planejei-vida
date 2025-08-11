// This file uses server-side code.
'use server';

/**
 * @fileOverview Provides personalized financial advice based on user's financial data.
 *
 * - getFinancialAdvice - A function that takes income, expenses, and savings goals as input and returns financial advice.
 * - FinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - FinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  expenses: z.number().describe('The user\'s monthly expenses.'),
  savingsGoals: z.string().describe('The user\'s savings goals.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice for the user.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a personal finance advisor. Based on the user's income, expenses, and savings goals, provide personalized financial advice.

Income: {{{income}}}
Expenses: {{{expenses}}}
Savings Goals: {{{savingsGoals}}}

Provide specific and actionable advice to help the user improve their financial situation.`,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
