import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {onCall} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

setGlobalOptions({maxInstances: 10});

admin.initializeApp();
const db = admin.firestore();

// Helper function to delete a collection in batches
const deleteCollection = async (collectionPath: string, batchSize: number) => {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy("__name__").limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
};

const deleteQueryBatch = async (query: FirebaseFirestore.Query, resolve: (value?: unknown) => void) => {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
};


// Deletes all data associated with a user in Firestore.
export const deleteAllUserData = onCall({
    // We don't need to pass the UID from the client.
    // The callable function context includes auth information.
}, async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in to delete your data.",
        );
    }

    logger.info(`User ${uid} has requested to delete all their data.`);

    // List of top-level collections for a user
    const collectionsToDelete = [
        "advices",
        "categories",
        "debts",
        "favorites",
        "goals",
        "investments",
    ];

    // List of monthly collections
    const monthlyCollections = ["income", "expenses", "monthlyPlan"];

    try {
        // Delete simple top-level collections
        for (const collection of collectionsToDelete) {
            await deleteCollection(`users/${uid}/${collection}`, 50);
            logger.info(`Deleted collection ${collection} for user ${uid}`);
        }

        // Delete monthly (nested) collections
        for (const collectionName of monthlyCollections) {
             const monthlyCollectionRef = db.collection(`users/${uid}/${collectionName}`);
             const monthsSnapshot = await monthlyCollectionRef.get();
             for (const monthDoc of monthsSnapshot.docs) {
                 await deleteCollection(`users/${uid}/${collectionName}/${monthDoc.id}/items`, 50);
                 await monthDoc.ref.delete(); // Delete the month document itself
             }
             logger.info(`Deleted all subcollections for ${collectionName} for user ${uid}`);
        }
        
        logger.info(`Successfully deleted all data for user ${uid}.`);
        return {success: true, message: "All user data deleted successfully."};
    } catch (error) {
        logger.error(`Error deleting data for user ${uid}:`, error);
        throw new functions.https.HttpsError(
            "internal",
            "An error occurred while deleting user data.",
        );
    }
});
