import { doc, updateDoc, type DocumentData } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function UpdateDocument(
    collectionName: string,
    documentId: string,
    data: DocumentData,
): Promise<void> {
    try {
        runtimeMeasureStart("firestore-update");

        logger(
            "FirestoreService",
            "info",
            `${collectionName}/${documentId} 부분 업데이트...`,
        );

        await updateDoc(doc(db, collectionName, documentId), data);

        logger("FirestoreService", "info", "문서 부분 업데이트 완료");

        runtimeMeasureEnd("firestore-update");
    } catch (error: unknown) {
        logger("FirestoreService", "error", "문서 부분 업데이트 실패", (error as Error).message);

        runtimeMeasureEnd("firestore-update");
        throw error;
    }
}
