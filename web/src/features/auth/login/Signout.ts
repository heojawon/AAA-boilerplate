import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function SignOut(): Promise<void> {
    try {
        runtimeMeasureStart("logout");
        logger("LogoutService", "info", "로그아웃 시도...");

        await signOut(auth);

        logger("LogoutService", "info", "로그아웃에 성공하였습니다.");
        runtimeMeasureEnd("logout");
    } catch (error: any) {
        logger(
            "LogoutService",
            "error",
            "로그아웃에 실패하였습니다.",
            error.message,
        );

        runtimeMeasureEnd("logout");
        throw error;
    }
}
