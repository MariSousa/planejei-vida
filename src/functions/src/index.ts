
import {setGlobalOptions} from 'firebase-functions/v2';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import {onCall, onCallGenkit} from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import {genkit, z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineSecret} from 'firebase-functions/params';
import {enableFirebaseTelemetry} from '@genkit-ai/firebase';

// Genkit Initialization
const apiKey = defineSecret('GOOGLE_GENAI_API_KEY');
enableFirebaseTelemetry();
const ai = genkit({
  plugins: [googleAI()],
});

// Firebase Admin Initialization
setGlobalOptions({maxInstances: 10});
admin.initializeApp();
const db = admin.firestore();


// Callable Function to delete all user data
export const deleteAllUserData = onCall(
  {
    // We don't need to pass the UID from the client.
    // The callable function context includes auth information.
  },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to delete your data.'
      );
    }

    logger.info(`User ${uid} has requested to delete all their data.`);

    const simpleCollectionsToDelete = [
      'advices',
      'categories',
      'debts',
      'favorites',
      'goals',
      'investments',
    ];

    const nestedMonthlyCollections = ['income', 'expenses', 'monthlyPlan'];

    try {
      // Delete simple top-level collections
      for (const collection of simpleCollectionsToDelete) {
        const path = `users/${uid}/${collection}`;
        await deleteCollection(path, 50);
        logger.info(`Deleted collection ${path}`);
      }

      // Delete nested monthly collections
      for (const collectionName of nestedMonthlyCollections) {
        const monthlyCollectionRef = db.collection(
          `users/${uid}/${collectionName}`
        );
        const monthsSnapshot = await monthlyCollectionRef.get();

        for (const monthDoc of monthsSnapshot.docs) {
          const itemsPath = `users/${uid}/${collectionName}/${monthDoc.id}/items`;
          await deleteCollection(itemsPath, 50);
          await monthDoc.ref.delete();
        }
        logger.info(
          `Deleted all subcollections and month documents for ${collectionName} for user ${uid}`
        );
      }

      logger.info(`Successfully deleted all data for user ${uid}.`);
      return {success: true, message: 'All user data deleted successfully.'};
    } catch (error) {
      logger.error(`Error deleting data for user ${uid}:`, error);
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while deleting user data.'
      );
    }
  }
);

// Helper function to delete a collection in batches
const deleteCollection = async (collectionPath: string, batchSize: number) => {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
};

const deleteQueryBatch = async (
  query: FirebaseFirestore.Query,
  resolve: (value?: unknown) => void
) => {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
};


// Genkit Sample Flow
const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string().describe('A restaurant theme').default('seafood'),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (subject, {sendChunk}) => {
    const prompt = `Suggest an item for the menu of a 
  ${subject} themed restaurant`;
    const {response, stream} = ai.generateStream({
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
  }
);

export const menuSuggestion = onCallGenkit(
  {
    secrets: [apiKey],
  },
  menuSuggestionFlow
);
