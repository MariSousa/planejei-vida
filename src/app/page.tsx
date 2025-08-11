import FinancialDashboard from '@/components/financial-dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm no-print">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-2xl font-bold text-primary font-headline">Planejei</h1>
          <p className="hidden text-muted-foreground md:block">Seu assistente financeiro pessoal</p>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <FinancialDashboard />
      </main>
      <footer className="mt-auto border-t py-6 no-print">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Planejei. Todos os direitos reservados.
          </div>
      </footer>
    </div>
  );
}
