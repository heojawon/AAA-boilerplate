import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function SendPasswordResetEmail(
    email: string,
): Promise<void> {
    try {
        runtimeMeasureStart("password-reset");

        logger("UserAuthService", "info", "비밀번호 재설정 메일 전송...");

        await sendPasswordResetEmail(auth, email);

        logger(
            "UserAuthService",
            "info",
            "비밀번호 재설정 메일을 전송했습니다.",
        );

        runtimeMeasureEnd("password-reset");
    } catch (error: unknown) {
        logger(
            "UserAuthService",
            "error",
            "비밀번호 재설정 메일 전송 실패",
            (error as Error).message,
        );

        runtimeMeasureEnd("password-reset");
        throw error;
    }
}
