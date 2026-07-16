import { auth } from "./../../../firebase/firebase";
import { reload } from "firebase/auth";
import { logger } from "../../logger/logger";

export default async function CheckEmailVerified(): Promise<boolean> {
    if (!auth.currentUser) return false;

    await reload(auth.currentUser);

    logger(
        "UserService",
        "info",
        `이메일 인증 여부 : ${auth.currentUser.emailVerified}`,
    );

    return auth.currentUser.emailVerified;
}
