import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function UpdatePassword(
    newPassword: string,
): Promise<void> {
    try {
        runtimeMeasureStart("update-password");

        logger("UserService", "info", "비밀번호 변경 시도...");

        if (!auth.currentUser) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        await updatePassword(auth.currentUser, newPassword);

        logger("UserService", "info", "비밀번호 변경 완료.");

        runtimeMeasureEnd("update-password");
    } catch (error: any) {
        logger("UserService", "error", "비밀번호 변경 실패", error.message);

        runtimeMeasureEnd("update-password");
        throw error;
    }
}
