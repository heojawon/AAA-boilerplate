import { doc, setDoc, type DocumentData } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function SetDocument(
    collectionName: string,
    documentId: string,
    data: DocumentData,
): Promise<void> {
    try {
        runtimeMeasureStart("firestore-set");

        logger(
            "FirestoreService",
            "info",
            `${collectionName}/${documentId} 저장...`,
        );

        await setDoc(doc(db, collectionName, documentId), data);

        logger("FirestoreService", "info", "문서 저장 완료");

        runtimeMeasureEnd("firestore-set");
    } catch (error: unknown) {
        logger("FirestoreService", "error", "문서 저장 실패", (error as Error).message);

        runtimeMeasureEnd("firestore-set");
        throw error;
    }
}
