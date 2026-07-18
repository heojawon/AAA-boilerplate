import {
    createUserWithEmailAndPassword,
    type UserCredential,
} from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function CreateWithEmailAndPassword(
    email: string,
    password: string,
): Promise<UserCredential> {
    try {
        runtimeMeasureStart("create");
        logger("UserAuthService", "info", "계정 생성 시도...");
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        logger("UserAuthService", "info", "생성에 성공하였습니다.");
        runtimeMeasureEnd("create");
        return userCredential;
    } catch (error: unknown) {
        logger(
            "UserAuthService",
            "error",
            "계정 생성에 실패하였습니다.",
            (error as Error).message,
        );
        runtimeMeasureEnd("create");
        throw error;
    }
}
