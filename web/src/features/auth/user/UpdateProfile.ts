import { updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function UpdateProfile(
    displayName: string,
    photoURL?: string,
): Promise<void> {
    try {
        if (!auth.currentUser) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        runtimeMeasureStart("update-profile");

        logger("UserService", "info", "프로필 수정 시도...");

        await updateProfile(auth.currentUser, {
            displayName,
            photoURL,
        });

        logger("UserService", "info", "프로필 수정 완료");

        runtimeMeasureEnd("update-profile");
    } catch (error: any) {
        logger("UserService", "error", "프로필 수정 실패", error.message);

        runtimeMeasureEnd("update-profile");
        throw error;
    }
}
