import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function SignInWithEmailAndPassword(
    email: string,
    password: string,
): Promise<UserCredential> {
    try {
        runtimeMeasureStart("login");
        logger("LoginService", "info", "로그인 시도...");
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        logger("LoginService", "info", "로그인에 성공하였습니다.");
        runtimeMeasureEnd("login");
        return userCredential;
    } catch (error: any) {
        logger(
            "LoginService",
            "error",
            "로그인에 실패하였습니다:",
            error.message,
        );

        runtimeMeasureEnd("login");
        throw error;
    }
}
