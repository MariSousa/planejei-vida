import {genkit, z} from "genkit";
import {googleAI} from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");
import {enableFirebaseTelemetry} from "@genkit-ai/firebase";

enableFirebaseTelemetry();

const ai = genkit({
    plugins: [
        googleAI(),
    ],
});

const menuSuggestionFlow = ai.defineFlow({
    name: "menuSuggestionFlow",
    inputSchema: z.string().describe("A restaurant theme").default("seafood"),
    outputSchema: z.string(),
    streamSchema: z.string(),
}, async (subject, { sendChunk }) => {
    const prompt =`Suggest an item for the menu of a ${subject} themed restaurant`;
    const { response, stream } = ai.generateStream({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: prompt,
        config: {
            temperature: 1,
        },
    });

    for await (const chunk of stream) {
        sendChunk(chunk.text);
    }

    return (await response).text;
});

export const menuSuggestion = onCallGenkit({
    secrets: [apiKey],
}, menuSuggestionFlow);
