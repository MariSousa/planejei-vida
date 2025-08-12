
import {setGlobalOptions} from "firebase-functions/v2";
import * as functions from "firebase-functions";
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

    // List of top-level collections for a user that are simple (no nested collections)
    const simpleCollectionsToDelete = [
        "advices",
        "categories",
        "debts",
        "favorites",
        "goals",
        "investments",
    ];

    // List of top-level collections that have monthly nested collections of items
    const nestedMonthlyCollections = ["income", "expenses", "monthlyPlan"];

    try {
        // Delete simple top-level collections
        for (const collection of simpleCollectionsToDelete) {
            const path = `users/${uid}/${collection}`;
            await deleteCollection(path, 50);
            logger.info(`Deleted collection ${path}`);
        }

        // Delete nested monthly collections
        for (const collectionName of nestedMonthlyCollections) {
            const monthlyCollectionRef = db.collection(`users/${uid}/${collectionName}`);
            const monthsSnapshot = await monthlyCollectionRef.get();
            
            for (const monthDoc of monthsSnapshot.docs) {
                // Delete the "items" subcollection within each month document
                const itemsPath = `users/${uid}/${collectionName}/${monthDoc.id}/items`;
                await deleteCollection(itemsPath, 50);
                
                // After deleting the subcollection, delete the month document itself
                await monthDoc.ref.delete();
            }
             logger.info(`Deleted all subcollections and month documents for ${collectionName} for user ${uid}`);
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
