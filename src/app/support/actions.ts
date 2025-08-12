
'use server';

import { rtdb } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { revalidatePath } from 'next/cache';

interface TicketInput {
    subject: string;
    message: string;
    userEmail: string;
    userId: string;
}

export async function sendSupportTicket(input: TicketInput): Promise<{ error?: string }> {
    if (!input.userId) {
        return { error: 'Você precisa estar logado para enviar uma solicitação de suporte.' };
    }

    try {
        // The security rules are set at /supportTickets/$uid.
        // So, we need to write to a path like /supportTickets/{userId}/{ticketId}.
        const userTicketsRef = ref(rtdb, `supportTickets/${input.userId}`);
        const newTicketRef = push(userTicketsRef); // This creates a new unique key for the ticket
        
        await set(newTicketRef, {
            subject: input.subject,
            message: input.message,
            userEmail: input.userEmail,
            status: 'Aberto',
            date: new Date().toISOString(),
        });
        
        revalidatePath('/support');

        return {};
    } catch (error) {
        console.error("Error sending support ticket to RTDB: ", error);
        return { error: 'Não foi possível enviar sua mensagem. Verifique as regras de segurança do seu Realtime Database e tente novamente.' };
    }
}
