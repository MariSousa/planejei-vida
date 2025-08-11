// This file uses server-side code.
'use server';

import { getFinancialAdvice, type FinancialAdviceInput } from '@/ai/flows/financial-advice';

export async function getAdviceAction(input: FinancialAdviceInput) {
  try {
    const result = await getFinancialAdvice(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get financial advice.' };
  }
}
