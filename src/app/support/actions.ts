
'use server';

import { rtdb } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/firebase'; // Assuming this is the correct import path for your auth instance

interface TicketInput {
    subject: string;
    message: string;
    userEmail: string;
    userId: string; // This can potentially be removed if you get the UID from auth
}

export async function sendSupportTicket(input: TicketInput): Promise<{ error?: string }> {
    const user = await auth.currentUser; // Get the authenticated user

    if (!user) {
        return { error: 'Você precisa estar logado para enviar uma solicitação de suporte.' };
    }
    try {
        // The security rules are set at /supportTickets/$uid.
        // So, we need to write to a path like /supportTickets/{userId}/{ticketId}.
        const userTicketsRef = ref(rtdb, `supportTickets/${input.userId}`);
        const newTicketRef = push(userTicketsRef); // This creates a new unique key for the ticket
        
        await set(newTicketRef, {
            subject: input.subject,
            message: input.message, // You might also get the email from the authenticated user
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
