import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';

const helloFlow = ai.defineFlow({ name: 'helloFlow' }, async (name: string) => {
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `Hello Gemini, my name is ${name}`,
  });
  console.log(output);
  return output;
});

helloFlow('Chris');

import '@/ai/flows/personalized-savings-advice.ts';
