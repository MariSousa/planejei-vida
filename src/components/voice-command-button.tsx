
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Frown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseExpenseFromText } from '@/ai/flows/expense-parser';
import { useFinancials } from '@/hooks/use-financials';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

type Status = 'idle' | 'listening' | 'processing' | 'error' | 'success';

const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null;

export function VoiceCommandButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const finalTranscriptRef = useRef(''); // Use a ref to hold the final transcript
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
    recognition.continuous = false; // Process after a single utterance
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      finalTranscriptRef.current = final || interim;
      setTranscript(final || interim);
    };

    recognition.onend = async () => {
      // Use the ref for the most up-to-date value
      const finalTranscript = finalTranscriptRef.current.trim();
      
      if (finalTranscript === '') {
          setStatus('idle');
          return;
      }
      
      setStatus('processing');
      try {
        const referenceDate = format(new Date(), 'yyyy-MM-dd');
        const result = await parseExpenseFromText({ query: finalTranscript, referenceDate });

        if (result.error) {
          toast({ title: 'Não entendi direito', description: result.error, variant: 'destructive' });
          setStatus('error');
          setTimeout(() => {
              handleOpenChange(false);
          }, 3000);
          return;
        }

        const { amount, category, date } = result;

        await addExpense({
          amount: amount / 100,
          category: category,
        }, new Date(date + 'T00:00:00'));

        toast({
          title: 'Gasto Adicionado!',
          description: `Gasto de ${category} no valor de R$ ${(amount / 100).toFixed(2)} foi adicionado.`,
          className: 'border-accent'
        });
        setStatus('success');
         setTimeout(() => {
            handleOpenChange(false);
        }, 2000);

      } catch (e) {
        console.error('Error processing voice command:', e);
        toast({ title: 'Erro ao processar comando', description: 'Houve um problema com a IA. Tente novamente.', variant: 'destructive' });
        setStatus('error');
        setTimeout(() => {
            handleOpenChange(false);
        }, 3000);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
       if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({ title: 'Erro no reconhecimento de voz', description: 'Não consegui te ouvir. Verifique a permissão do microfone.', variant: 'destructive'});
          setStatus('error');
           setTimeout(() => {
                handleOpenChange(false);
            }, 3000);
      } else {
        setStatus('idle');
      }
    };
    
    recognitionRef.current = recognition;
  }, [addExpense, toast]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && status === 'listening') {
      recognitionRef.current?.abort();
    }
    setOpen(isOpen);
    setStatus('idle');
    setTranscript('');
    finalTranscriptRef.current = '';
  }

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
    return null;
  }

  const getStatusContent = () => {
      switch (status) {
          case 'listening':
              return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Mic className="h-12 w-12 text-primary animate-pulse mb-4" />
                    <p className="font-semibold">Ouvindo...</p>
                    <p className="text-muted-foreground text-lg h-14 mt-2">{transcript || ' '}</p>
                </div>
              );
          case 'processing':
              return (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                    <p className="font-semibold">Processando...</p>
                     <p className="text-muted-foreground text-lg h-14 mt-2">{transcript}</p>
                </div>
              );
        case 'error':
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <Frown className="h-12 w-12 text-destructive mb-4" />
                    <p className="font-semibold text-destructive">Ocorreu um erro</p>
                    <p className="text-muted-foreground text-center mt-2">Não foi possível adicionar seu gasto. Tente novamente.</p>
                </div>
            );
        case 'success':
             return (
                <div className="flex flex-col items-center justify-center h-full">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <p className="font-semibold text-green-500">Gasto adicionado!</p>
                </div>
            );
          case 'idle':
          default:
            return (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <DialogDescription>
                        Diga o que você gastou, incluindo valor, descrição e data.
                    </DialogDescription>
                    <div className="my-6 p-4 bg-muted rounded-lg w-full">
                        <p className="text-sm font-medium">Por exemplo:</p>
                        <p className="text-sm text-muted-foreground italic">"gastei 50 reais no supermercado ontem"</p>
                    </div>
                </div>
            );
      }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className={cn(
            'fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50 transition-colors duration-300'
          )}
        >
          <Mic className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
         <DialogHeader>
          <DialogTitle>Adicionar Gasto por Voz</DialogTitle>
        </DialogHeader>
        
        <div className="min-h-[200px] flex items-center justify-center">
            {getStatusContent()}
        </div>

        <DialogFooter>
           {status === 'idle' && (
             <Button type="button" onClick={handleToggleListening}>
                Começar a Ouvir
             </Button>
          )}
           {status === 'listening' && (
             <Button type="button" variant="destructive" onClick={handleToggleListening}>
                Parar de Ouvir
             </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
