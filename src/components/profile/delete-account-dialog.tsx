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
import { generateReportHtml } from '../reports-downloader'; // Assuming this can be exported and used
import type { useFinancials } from '@/hooks/use-financials';

interface DeleteAccountDialogProps {
    financials: ReturnType<typeof useFinancials>;
}

export function DeleteAccountDialog({ financials }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { deleteUserAccount } = useAuth();
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state on close
      setStep(1);
      setConfirmationText('');
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

    // A helper function to avoid duplicating the HTML generation logic here
    const generateSingleReportHtml = (type: any) => {
        // This is a simplified version of the logic in ReportsDownloader
        // For a real app, this would be properly refactored into a shared utility
        const dataMap: any = {
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


  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
        await deleteUserAccount();
        // The redirection will be handled by the auth context
    } catch (error: any) {
        toast({
            title: 'Erro ao Deletar Conta',
            description: error.message,
            variant: 'destructive',
        });
        setIsLoading(false);
        setOpen(false); // Close dialog on error
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
                        <AlertDialogAction onClick={() => setStep(2)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Entendo, prosseguir com a exclusão
                        </AlertDialogAction>
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
                        onClick={handleDeleteAccount}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Deletar minha conta permanentemente
                    </Button>
                </AlertDialogFooter>
            </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
