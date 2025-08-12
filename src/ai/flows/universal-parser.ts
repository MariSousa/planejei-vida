
'use server';

/**
 * @fileOverview An AI flow to parse a natural language query into a structured financial action object.
 *
 * - parseFinancialAction - Parses text to create a financial action (expense, income, goal).
 * - UniversalParserInput - The input type for the function.
 * - UniversalParserOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UniversalParserInputSchema = z.object({
  query: z.string().describe('O texto dito pelo usuário para realizar uma ação financeira.'),
  referenceDate: z.string().describe('A data atual no formato ISO (YYYY-MM-DD) para usar como referência caso o usuário diga "hoje", "ontem", etc.'),
});
export type UniversalParserInput = z.infer<typeof UniversalParserInputSchema>;

const AddExpenseActionSchema = z.object({
    action: z.enum(['add_expense']),
    payload: z.object({
        amount: z.number().describe('O valor do gasto em centavos. Ex: R$ 8,50 deve ser 850.'),
        category: z.string().describe('A categoria do gasto. Ex: Padaria, Supermercado, Aluguel.'),
        date: z.string().describe('A data do gasto no formato ISO (YYYY-MM-DD).'),
    })
});

const AddIncomeActionSchema = z.object({
    action: z.enum(['add_income']),
    payload: z.object({
        amount: z.number().describe('O valor do ganho em centavos. Ex: R$ 1500 deve ser 150000.'),
        source: z.string().describe('A fonte do ganho. Ex: Salário, Freelance, Venda.'),
        date: z.string().describe('A data do ganho no formato ISO (YYYY-MM-DD).'),
    })
});

const AddGoalActionSchema = z.object({
    action: z.enum(['add_goal']),
    payload: z.object({
        name: z.string().describe('O nome da meta. Ex: Viagem para o Japão.'),
        targetAmount: z.number().describe('O valor alvo da meta em centavos. Ex: R$ 15.000 deve ser 1500000.'),
    })
});

const ErrorActionSchema = z.object({
    action: z.enum(['error']),
    payload: z.object({
        message: z.string().describe('A mensagem de erro explicando o que deu errado ou o que faltou na query do usuário.')
    })
});

const UniversalParserOutputSchema = z.discriminatedUnion('action', [
    AddExpenseActionSchema,
    AddIncomeActionSchema,
    AddGoalActionSchema,
    ErrorActionSchema
]);
export type UniversalParserOutput = z.infer<typeof UniversalParserOutputSchema>;


export async function parseFinancialAction(input: UniversalParserInput): Promise<UniversalParserOutput> {
  return universalParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'universalParserPrompt',
  input: {schema: UniversalParserInputSchema},
  output: {schema: UniversalParserOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `<System>
Você é um assistente de finanças especialista em interpretar texto de um usuário para registrar uma transação ou criar um item financeiro.
Sua tarefa é identificar a **AÇÃO** (adicionar gasto, adicionar ganho, criar meta) e extrair os **DADOS** relevantes.

DATA DE REFERÊNCIA (HOJE): {{{referenceDate}}}

REGRAS GERAIS:
1.  **Identifique a Ação:** Analise a intenção principal do usuário. Ele quer registrar uma ação \`add_expense\`, \`add_income\`, ou \`add_goal\`?
2.  **Valores em Centavos:** Todos os valores monetários DEVEM ser convertidos para CENTAVOS. Ex: "R$ 8,50" se torna 850. "R$ 1.500" se torna 150000. "mil reais" significa multiplicar por 1000 e depois por 100.
3.  **Datas:**
    *   Interprete datas relativas ("hoje", "ontem") com base na data de referência.
    *   Se nenhuma data for mencionada para gastos ou ganhos, assuma a data de referência (hoje).
    *   Metas (\`add_goal\`) não precisam de data.
4.  **Erros:** Se você não conseguir identificar a ação ou faltarem dados essenciais (como valor para um gasto/ganho, ou nome/valor para uma meta), retorne uma ação \`error\` com uma mensagem clara explicando o que faltou.

REGRAS POR AÇÃO:
-   **\`add_expense\`**: Precisa de \`amount\` (em centavos), \`category\` e \`date\` (YYYY-MM-DD).
-   **\`add_income\`**: Precisa de \`amount\` (em centavos), \`source\` (fonte da renda) e \`date\` (YYYY-MM-DD).
-   **\`add_goal\`**: Precisa de \`name\` (nome da meta) e \`targetAmount\` (valor alvo em centavos).

</System>

<Exemplos>
Query: "adicionar gasto de 8,00 na padaria ontem"
Referência: 2024-08-13
Output: { "action": "add_expense", "payload": { "amount": 800, "category": "Padaria", "date": "2024-08-12" } }

Query: "recebi 500 reais de um freelance"
Referência: 2024-08-13
Output: { "action": "add_income", "payload": { "amount": 50000, "source": "Freelance", "date": "2024-08-13" } }

Query: "quero criar uma meta de viagem para o japão de 15 mil reais"
Referência: 2024-08-13
Output: { "action": "add_goal", "payload": { "name": "Viagem para o Japão", "targetAmount": 1500000 } }

Query: "gastei no cinema"
Referência: 2024-08-13
Output: { "action": "error", "payload": { "message": "Não consegui identificar o valor do gasto. Por favor, tente novamente incluindo o valor." } }
</Exemplos>

<Tarefa>
Analise a seguinte query do usuário e retorne o JSON estruturado com a ação e o payload corretos.
Query do Usuário: "{{{query}}}"
</Tarefa>
`,
});

const universalParserFlow = ai.defineFlow(
  {
    name: 'universalParserFlow',
    inputSchema: UniversalParserInputSchema,
    outputSchema: UniversalParserOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
