import { deleteUser } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

export default async function DeleteUser(): Promise<void> {
    try {
        if (!auth.currentUser) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        runtimeMeasureStart("delete-user");

        logger("DeleteUserService", "info", "회원 탈퇴 시도...");

        await deleteUser(auth.currentUser);

        logger("DeleteUserService", "info", "회원 탈퇴 완료");

        runtimeMeasureEnd("delete-user");
    } catch (error: any) {
        logger("DeleteUserService", "error", "회원 탈퇴 실패", error.message);

        runtimeMeasureEnd("delete-user");
        throw error;
    }
}
