'use server';

/**
 * @fileOverview An AI flow to parse a natural language query into a structured expense object.
 *
 * - parseExpenseFromText - Parses text to create an expense.
 * - ExpenseParserInput - The input type for the function.
 * - ExpenseParserOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const ExpenseParserInputSchema = z.object({
  query: z.string().describe('O texto dito pelo usuário para adicionar um gasto.'),
  referenceDate: z.string().describe('A data atual no formato ISO (YYYY-MM-DD) para usar como referência caso o usuário diga "hoje", "ontem", etc.'),
});
export type ExpenseParserInput = z.infer<typeof ExpenseParserInputSchema>;

const ExpenseParserOutputSchema = z.object({
    amount: z.number().describe('O valor do gasto em centavos. Ex: R$ 8,50 deve ser 850.'),
    category: z.string().describe('A categoria do gasto. Ex: Padaria, Supermercado, Aluguel.'),
    date: z.string().describe('A data do gasto no formato ISO (YYYY-MM-DD).'),
    error: z.string().optional().describe('Uma mensagem de erro se o gasto não puder ser extraído do texto.')
});
export type ExpenseParserOutput = z.infer<typeof ExpenseParserOutputSchema>;

export async function parseExpenseFromText(input: ExpenseParserInput): Promise<ExpenseParserOutput> {
  return expenseParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expenseParserPrompt',
  input: {schema: ExpenseParserInputSchema},
  output: {schema: ExpenseParserOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `<System>
Você é um assistente de finanças especializado em interpretar texto de um usuário e extrair informações para registrar um novo gasto.
Sua tarefa é analisar a frase do usuário, identificar o VALOR, a CATEGORIA e a DATA do gasto.

DATA DE REFERÊNCIA (HOJE): {{{referenceDate}}}

REGRAS:
1.  **Valor:** O valor deve ser convertido para CENTAVOS. Por exemplo, "8 reais e 50 centavos" se torna 850. "15 reais" se torna 1500.
2.  **Categoria:** Identifique a descrição do gasto e use-a como categoria. Ex: "gasto de 8,00 na padaria" -> a categoria é "Padaria". "comprei um café" -> a categoria é "Café".
3.  **Data:**
    *   Interprete datas relativas como "hoje", "ontem", "anteontem" com base na data de referência.
    *   Se a data for específica (ex: "dia 12 de agosto de 2025"), converta-a para o formato YYYY-MM-DD.
    *   Se NENHUMA data for mencionada, assuma a data de referência (hoje) como padrão.
4.  **Erro:** Se você não conseguir identificar um valor ou uma categoria clara, retorne uma mensagem no campo 'error' explicando o que faltou. Não invente valores ou categorias. Se apenas a data estiver faltando, não retorne um erro, apenas use a data de hoje.
</System>

<Exemplos>
Query: "adicionar gasto de 8,00 na padaria dia 12/08/2025"
Referência: 2024-08-13
Output: { "amount": 800, "category": "Padaria", "date": "2025-08-12" }

Query: "lance um gasto de 25 reais no supermercado ontem"
Referência: 2024-08-13
Output: { "amount": 2500, "category": "Supermercado", "date": "2024-08-12" }

Query: "restaurante 150 reais"
Referência: 2024-08-13
Output: { "amount": 15000, "category": "Restaurante", "date": "2024-08-13" }

Query: "uber"
Referência: 2024-08-13
Output: { "error": "Não consegui identificar o valor do gasto. Por favor, tente novamente incluindo o valor." }
</Exemplos>

<Tarefa>
Analise a seguinte query do usuário e retorne o JSON estruturado.
Query do Usuário: "{{{query}}}"
</Tarefa>
`,
});

const expenseParserFlow = ai.defineFlow(
  {
    name: 'expenseParserFlow',
    inputSchema: ExpenseParserInputSchema,
    outputSchema: ExpenseParserOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
