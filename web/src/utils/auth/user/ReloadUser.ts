import { reload } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function ReloadUser(): Promise<void> {
    try {
        runtimeMeasureStart("reload-user");

        logger("UserService", "info", "사용자 정보 새로고침...");

        if (!auth.currentUser) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        await reload(auth.currentUser);

        logger("UserService", "info", "새로고침 완료.");

        runtimeMeasureEnd("reload-user");
    } catch (error: unknown) {
        logger("UserService", "error", "새로고침 실패", (error as Error).message);

        runtimeMeasureEnd("reload-user");
        throw error;
    }
}
