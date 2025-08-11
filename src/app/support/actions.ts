
'use server';

import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

interface TicketInput {
    subject: string;
    message: string;
    userEmail: string;
    userId: string; // Add userId to the input
}

export async function sendSupportTicket(input: TicketInput): Promise<{ error?: string }> {
    // We get the userId from the client now, which is more reliable.
    if (!input.userId) {
        return { error: 'Você precisa estar logado para enviar uma solicitação de suporte.' };
    }

    try {
        await addDoc(collection(db, `users/${input.userId}/supportTickets`), {
            subject: input.subject,
            message: input.message,
            userEmail: input.userEmail,
            userId: input.userId,
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
