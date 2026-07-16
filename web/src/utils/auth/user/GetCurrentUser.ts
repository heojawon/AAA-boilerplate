import type { User } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";

export default function GetCurrentUser(): User | null {
    logger("UserService", "info", "회원 탈퇴 시도...");
    return auth.currentUser;
}
