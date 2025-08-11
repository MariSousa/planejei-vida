
'use server';

import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';

interface TicketInput {
    subject: string;
    message: string;
    userEmail: string;
}

export async function sendSupportTicket(input: TicketInput): Promise<{ error?: string }> {
    const user = auth.currentUser;

    if (!user) {
        return { error: 'Você precisa estar logado para enviar uma solicitação de suporte.' };
    }

    try {
        await addDoc(collection(db, `users/${user.uid}/supportTickets`), {
            ...input,
            userId: user.uid,
            status: 'Aberto',
            date: new Date().toISOString(),
        });
        
        // This won't revalidate a client component, but it's good practice
        // in case we ever want to display sent tickets.
        revalidatePath('/support');

        return {};
    } catch (error) {
        console.error("Error sending support ticket: ", error);
        return { error: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.' };
    }
}
