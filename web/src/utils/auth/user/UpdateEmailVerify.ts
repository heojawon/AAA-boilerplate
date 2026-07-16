import { verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function UpdateEmail(newEmail: string): Promise<void> {
    try {
        runtimeMeasureStart("update-email");

        logger("UserService", "info", "이메일 변경 요청...");

        if (!auth.currentUser) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

        logger("UserService", "info", "인증 메일을 전송했습니다.");

        runtimeMeasureEnd("update-email");
    } catch (error: any) {
        logger("UserService", "error", "이메일 변경 실패", error.message);

        runtimeMeasureEnd("update-email");
        throw error;
    }
}
