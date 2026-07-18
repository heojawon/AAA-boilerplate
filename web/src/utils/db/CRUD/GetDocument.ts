import {
    doc,
    getDoc,
    type DocumentData,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function GetDocument(
    collectionName: string,
    documentId: string,
): Promise<DocumentSnapshot<DocumentData>> {
    try {
        runtimeMeasureStart("firestore-get");

        logger(
            "FirestoreService",
            "info",
            `${collectionName}/${documentId} 조회...`,
        );

        const snapshot = await getDoc(doc(db, collectionName, documentId));

        logger("FirestoreService", "info", "문서 조회 완료");

        runtimeMeasureEnd("firestore-get");

        return snapshot;
    } catch (error: unknown) {
        logger("FirestoreService", "error", "문서 조회 실패", (error as Error).message);

        runtimeMeasureEnd("firestore-get");
        throw error;
    }
}
