
'use server';

import { generateSavingsAdvice, type SavingsAdviceInput, type SavingsAdviceOutput } from '@/ai/flows/personalized-savings-advice';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// This type is slightly different from the hook one, as it includes the goal object
// and is designed to be called from the server action.
interface ActionInput extends SavingsAdviceInput {
    goalId: string;
}

export async function getSavingsAdvice(input: ActionInput): Promise<{ advice: SavingsAdviceOutput['advice'] | null, error: string | null }> {
  try {
    const result = await generateSavingsAdvice(input);
    
    // We get the current user on the server to save the advice securely.
    // Note: This relies on server-side Firebase Auth state.
    // For production apps, you'd pass the user token or use a more robust session management.
    // This is a simplified approach for demonstration.
    // A proper implementation would require getting the user from the request context.
    // For this app, we'll simulate getting the user and saving.
    // In a real scenario, you'd pass the UID from the client after authentication.
    
    // This is a placeholder for where you would get the user ID on the server.
    // In a real Next.js app with proper authentication setup (like NextAuth.js or Clerk),
    // you would get the session and user ID here.
    // For this example, we'll assume the client-side logic handles passing the UID,
    // which we will handle by adding the advice via the useFinancials hook instead.

    return { advice: result.advice, error: null };
  } catch (error) {
    console.error("Error generating savings advice:", error);
    return { advice: null, error: 'Ocorreu um erro ao gerar o conselho. Tente novamente mais tarde.' };
  }
}
