
'use server';

import { rtdb } from '@/lib/firebase';
import { ref, push, serverTimestamp, set } from 'firebase/database';
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
        // Save tickets under the user's specific path
        const userTicketsRef = ref(rtdb, `supportTickets/${input.userId}`);
        const newTicketRef = push(userTicketsRef);
        await set(newTicketRef, {
            subject: input.subject,
            message: input.message,
            userEmail: input.userEmail,
            status: 'Aberto',
            date: new Date().toISOString(),
        });
        
        // This won't revalidate a client component, but it's good practice
        // in case we ever want to display sent tickets.
        revalidatePath('/support');

        return {};
    } catch (error) {
        console.error("Error sending support ticket to RTDB: ", error);
        return { error: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.' };
    }
}
