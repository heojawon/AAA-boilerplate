import {
    addDoc,
    collection,
    type DocumentReference,
    type DocumentData,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function AddDocument(
    collectionName: string,
    data: DocumentData,
): Promise<DocumentReference<DocumentData>> {
    try {
        runtimeMeasureStart("firestore-add");

        logger(
            "FirestoreService",
            "info",
            `${collectionName} 문서 생성 시도...`,
        );

        const docRef = await addDoc(collection(db, collectionName), data);

        logger("FirestoreService", "info", `문서 생성 완료 (${docRef.id})`);

        runtimeMeasureEnd("firestore-add");

        return docRef;
    } catch (error: unknown) {
        logger("FirestoreService", "error", "문서 생성 실패", (error as Error).message);

        runtimeMeasureEnd("firestore-add");
        throw error;
    }
}
