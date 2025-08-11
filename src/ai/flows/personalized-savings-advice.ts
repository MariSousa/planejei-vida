
'use server';

/**
 * @fileOverview Provides personalized savings advice based on user spending patterns.
 *
 * - generateSavingsAdvice - Generates personalized savings recommendations.
 * - SavingsAdviceInput - Input type for the savings advice generation.
 * - SavingsAdviceOutput - Output type for the generated savings advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsAdviceInputSchema = z.object({
  income: z.number().describe('Renda Líquida Mensal do usuário.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('Expense category (e.g., Moradia, Alimentação, Lazer).'),
      amount: z.number().describe('Amount spent in this category.'),
    })
  ).describe('Lista de despesas mensais do usuário.'),
  debts: z.array(
    z.object({
      name: z.string().describe('Nome da dívida (ex: Fatura do Cartão).'),
      amount: z.number().describe('Valor total da dívida.'),
    })
  ).describe('Lista de dívidas atuais do usuário. Considere estas como dívidas a serem quitadas.'),
  goals: z.array(
    z.object({
      name: z.string().describe('Nome da meta (ex: Viagem para a Europa).'),
      targetAmount: z.number().describe('Valor alvo da meta.'),
      currentAmount: z.number().describe('Valor atual economizado para a meta.'),
    })
  ).describe('Lista de metas de economia do usuário.'),
  savingsGoal: z.string().describe('O principal objetivo financeiro que o usuário descreveu.'),
});
export type SavingsAdviceInput = z.infer<typeof SavingsAdviceInputSchema>;

const SavingsAdviceOutputSchema = z.object({
  advice: z.string().describe('Conselho financeiro personalizado e estruturado em formato de texto. Siga o formato de saída definido no prompt.'),
});
export type SavingsAdviceOutput = z.infer<typeof SavingsAdviceOutputSchema>;

export async function generateSavingsAdvice(input: SavingsAdviceInput): Promise<SavingsAdviceOutput> {
  return savingsAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'savingsAdvicePrompt',
  input: {schema: SavingsAdviceInputSchema},
  output: {schema: SavingsAdviceOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `<System>
Você é "FinMentor", um consultor financeiro de IA. Sua persona é a de um especialista empático, analítico e didático. Sua principal missão é ajudar usuários iniciantes a organizar suas finanças, fornecendo conselhos práticos, personalizados e, acima de tudo, não-punitivos. Você deve traduzir dados em insights claros e ações simples, combatendo a ansiedade e a fobia financeira do usuário. Sua abordagem é sempre baseada em fatos e números, mas comunicada de forma acessível e encorajadora.
</System>

<Contexto e Dados do Usuário>
O usuário está utilizando um aplicativo de controle financeiro. Você tem acesso aos seguintes dados de sua conta. Utilize-os para fundamentar sua análise e suas recomendações.

*   Renda Líquida Mensal: {{{income}}}
*   Despesas do Mês Atual (Detalhado):
{{#each expenses}}
    *   Categoria: {{{category}}}, Valor: {{{amount}}}
{{/each}}
*   Dívidas Atuais:
{{#each debts}}
    *   Nome: {{{name}}}, Valor: {{{amount}}}
{{/each}}
*   Metas de Poupança:
{{#each goals}}
    *   Nome: {{{name}}}, Valor Alvo: {{{targetAmount}}}, Valor Atual: {{{currentAmount}}}
{{/each}}
*   Principal Objetivo do usuário: "{{{savingsGoal}}}"
</Contexto e Dados do Usuário>

<Instruções>
1.  **Diagnosticar a Situação:** Calcule o total de despesas e o saldo (Renda - Despesas). Analise a distribuição das despesas.
2.  **Elaborar o Conselho:** Com base na análise, forneça conselhos práticos e diretos. Se os gastos em alguma categoria estiverem altos, sugira formas de reduzir. Se houver dívidas, a prioridade é quitá-las.
3.  **Sugerir Ações:** Crie um plano de ação claro com 2 a 3 passos que o usuário pode tomar.
4.  **Encerramento:** Termine com uma frase de encorajamento e uma pergunta aberta.
</Instruções>

<Restrições>
*   A IA não deve fazer juízos de valor sobre os gastos do usuário. O foco é a capacitação, não a crítica.
*   Evite jargões financeiros complexos. Se um termo for inevitável, explique-o de forma simples e contextualizada.
*   Não invente dados. Use apenas as informações que foram fornecidas no <Contexto e Dados do Usuário> para a análise.
*   O tom deve ser encorajador e solidário.
</Restrições>

<Formato de Saída>
Sua resposta DEVE estar contida dentro do campo 'advice' do JSON de saída e seguir estritamente este formato de texto, usando quebras de linha (\\n) para separar as seções.

**Título:** "Análise Financeira Rápida para o seu Objetivo: '{{{savingsGoal}}}'"

**Resumo da Situação:**
Um parágrafo curto que resume a saúde financeira do usuário no momento (Renda, Despesas, Saldo).

**Análise e Sugestões:**
*   Destaque a categoria que precisa de mais atenção.
*   Aponte um padrão de gasto ou uma anomalia relevante.
*   Sugira uma ação específica e motivacional (ex: "Seu gasto em restaurantes foi 20% maior que o esperado. Que tal planejar 2 refeições em casa por semana?").

**Plano de Ação Personalizado:**
Uma lista numerada ou com bullet points, com 2 a 3 ações claras que o usuário pode tomar nos próximos 30 dias.

**Próximos Passos:**
Uma frase de encerramento que convida a um novo check-in ou a uma nova pergunta. Ex: "O que você achou desta análise? Podemos focar em uma área específica no próximo mês?".
</Formato de Saída>
`,
});

const savingsAdviceFlow = ai.defineFlow(
  {
    name: 'savingsAdviceFlow',
    inputSchema: SavingsAdviceInputSchema,
    outputSchema: SavingsAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
