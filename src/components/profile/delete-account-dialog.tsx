
'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { generateReportHtml } from '../reports-downloader';
import type { useFinancials } from '@/hooks/use-financials';
import { FirebaseError } from 'firebase/app';
import { Advice, Debt, Expense, Goal, Income, Investment, MonthlyPlanItem } from '@/types';

interface DeleteAccountDialogProps {
    financials: ReturnType<typeof useFinancials>;
}

export function DeleteAccountDialog({ financials }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { deleteUserAccount, reauthenticateUser } = useAuth();
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setConfirmationText('');
        setPassword('');
        setError('');
        setIsLoading(false);
      }, 200);
    }
    setOpen(isOpen);
  };
  
  const handleDownloadReport = () => {
    const reportTypes: (keyof typeof financials)[] = ['reportIncome', 'reportExpenses', 'reportMonthlyPlanItems', 'goals', 'advices', 'investments', 'debts'];
    
    let combinedHtml = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório Completo - Planejei</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
                .report-section { max-width: 90%; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 2rem; overflow-x: auto; }
                h1 { font-size: 1.75rem; color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #dee2e6; padding: 12px 15px; text-align: left; vertical-align: top; word-break: break-word; }
                th { background-color: #f1f3f5; font-weight: 600; text-transform: capitalize; }
                tr:nth-child(even) { background-color: #f8f9fa; }
                tr:hover { background-color: #e9ecef; }
                .no-data { text-align: center; padding: 20px; color: #6c757d; font-style: italic; }
                @media print { body { background-color: #fff; } .report-section { box-shadow: none; border: 1px solid #dee2e6; margin-bottom: 2rem; } }
            </style>
        </head>
        <body>
    `;

    const generateSingleReportHtml = (type: string) => {
        const dataMap: { [key: string]: (Income | Expense | MonthlyPlanItem | Goal | Advice | Investment | Debt)[] } = {
            reportIncome: financials.reportIncome,
            reportExpenses: financials.reportExpenses,
            reportMonthlyPlanItems: financials.reportMonthlyPlanItems,
            goals: financials.goals,
            advices: financials.advices,
            investments: financials.investments,
            debts: financials.debts,
        };
        return generateReportHtml(type, dataMap[type]);
    }

    reportTypes.forEach(type => {
        const reportContent = generateSingleReportHtml(type);
        const contentMatch = reportContent.match(/<body>(.*)<\/body>/s);
        if (contentMatch) {
            combinedHtml += `<div class="report-section">${contentMatch[1]}</div>`;
        }
    });

    combinedHtml += `</body></html>`;

    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
        reportWindow.document.write(combinedHtml);
        reportWindow.document.close();
    } else {
        toast({ title: "Por favor, habilite pop-ups para baixar o relatório.", variant: 'destructive' });
    }
  };


  const performDelete = async () => {
    setIsLoading(true);
    setError('');
    console.log("performDelete: Iniciando processo de deleção."); // Adicionado
    try {
        console.log("performDelete: Chamando deleteUserAccount..."); // Adicionado
        await deleteUserAccount();
        console.log("performDelete: deleteUserAccount concluída."); // Adicionado
        // Redirection will be handled by auth context
    } catch (error) {
         console.log("performDelete: Erro capturado."); // Adicionado
        if (error instanceof FirebaseError && error.code === 'auth/requires-recent-login') {
            console.log("performDelete: Erro auth/requires-recent-login. Indo para o passo 3."); // Adicionado
            setStep(3); // Go to reauthentication step
        } else {
             console.error("performDelete: Erro desconhecido:", error); // Adicionado para capturar outros erros
             const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
             toast({ title: 'Erro ao Deletar Conta', description: errorMessage, variant: 'destructive' });
             handleOpenChange(false);
        }
    } finally {
        console.log("performDelete: Finalizando."); // Adicionado
        setIsLoading(false);
    }
  };


  const handleReauthentication = async () => {
    setIsLoading(true);
    setError('');
    try {
      await reauthenticateUser(password);
      await performDelete(); // Retry deletion after successful reauthentication
    } catch (error) {
      setError('A senha está incorreta. Tente novamente.');
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deletar minha conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {step === 1 && (
            <>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os seus dados financeiros, metas e planejamentos serão permanentemente apagados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                     <Button variant="outline" onClick={() => {
                         handleDownloadReport();
                         toast({ title: 'Relatório Gerado!', description: 'Seu relatório completo foi aberto em uma nova aba.'});
                     }}>
                        Baixar meus dados antes
                    </Button>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <Button onClick={() => setStep(2)} variant="destructive">
                            Entendo, prosseguir com a exclusão
                        </Button>
                    </div>
                </AlertDialogFooter>
            </>
        )}
        {step === 2 && (
             <>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmação Final</AlertDialogTitle>
                    <AlertDialogDescription>
                        Para confirmar, por favor, digite <strong>DELETAR</strong> no campo abaixo.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="delete-confirm" className="sr-only">Confirmar exclusão</Label>
                    <Input
                        id="delete-confirm"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="DELETAR"
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setStep(1)}>Voltar</AlertDialogCancel>
                    <Button 
                        variant="destructive"
                        disabled={confirmationText !== 'DELETAR' || isLoading}
                        onClick={performDelete}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Deletar minha conta permanentemente
                    </Button>
                </AlertDialogFooter>
            </>
        )}
         {step === 3 && (
             <>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reautenticação Necessária</AlertDialogTitle>
                    <AlertDialogDescription>
                        Para sua segurança, precisamos que você confirme sua senha para continuar com a exclusão da conta.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="password-confirm">Sua Senha</Label>
                    <Input
                        id="password-confirm"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoFocus
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => handleOpenChange(false)}>Cancelar Exclusão</AlertDialogCancel>
                    <Button 
                        variant="destructive"
                        disabled={!password || isLoading}
                        onClick={handleReauthentication}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar e Deletar
                    </Button>
                </AlertDialogFooter>
            </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
