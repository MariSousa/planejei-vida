
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseExpenseFromText } from '@/ai/flows/expense-parser';
import { useFinancials } from '@/hooks/use-financials';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Status = 'idle' | 'listening' | 'processing' | 'error';

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null;

export function VoiceCommandButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { addExpense } = useFinancials();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
    };

    recognition.onresult = async (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        setTranscript(interimTranscript);

        if (finalTranscript) {
            setStatus('processing');
            recognition.stop();
            
            try {
                const referenceDate = format(new Date(), 'yyyy-MM-dd');
                const result = await parseExpenseFromText({ query: finalTranscript, referenceDate });

                if (result.error) {
                    toast({ title: 'Não entendi direito', description: result.error, variant: 'destructive' });
                    setStatus('error');
                    setTimeout(() => setStatus('idle'), 3000);
                    return;
                }

                const { amount, category, date } = result;
                
                await addExpense({
                    amount: amount / 100, // Convert cents to float
                    date: new Date(date + 'T00:00:00')
                }, new Date(date + 'T00:00:00'));

                toast({
                    title: 'Gasto Adicionado!',
                    description: `Gasto de ${category} no valor de R$ ${(amount / 100).toFixed(2)} foi adicionado.`,
                    className: 'border-accent'
                });
                setStatus('idle');
            } catch (e) {
                console.error('Error processing voice command:', e);
                toast({ title: 'Erro ao processar comando', description: 'Houve um problema com a IA. Tente novamente.', variant: 'destructive'});
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast({ title: 'Erro no reconhecimento de voz', description: 'Não consegui te ouvir. Verifique a permissão do microfone.', variant: 'destructive'});
      }
      setStatus('idle');
    };

    recognition.onend = () => {
        if (status === 'listening') {
            setStatus('idle');
        }
    };
    
    recognitionRef.current = recognition;
  }, [addExpense, status, toast]);

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (status === 'listening') {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isMounted || !SpeechRecognition) {
    return null; // Don't render button if API is not supported or on SSR
  }

  const getButtonContent = () => {
    switch (status) {
      case 'listening':
        return <Square className="h-6 w-6 text-red-500 animate-pulse" />;
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin" />;
      case 'error':
        return <Frown className="h-6 w-6 text-destructive" />;
      case 'idle':
      default:
        return <Mic className="h-6 w-6" />;
    }
  };
  
  return (
    <>
      {status === 'listening' && transcript && (
          <div className="fixed bottom-28 right-8 max-w-sm bg-primary text-primary-foreground p-3 rounded-lg shadow-lg z-50">
            <p className="text-sm">{transcript}</p>
          </div>
      )}
      <Button
        size="icon"
        className={cn(
          'fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50 transition-colors duration-300',
          status === 'listening' && 'bg-red-500/20 hover:bg-red-500/30',
          status === 'error' && 'bg-destructive/20'
        )}
        onClick={handleToggleListening}
        disabled={status === 'processing'}
      >
        {getButtonContent()}
      </Button>
    </>
  );
}
