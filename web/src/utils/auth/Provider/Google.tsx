import {
    GoogleAuthProvider,
    getRedirectResult,
    signInWithPopup,
    signInWithRedirect,
    type UserCredential,
} from "firebase/auth";

import { auth } from "../../../firebase/firebase";
import { logger } from "../../logger/logger";
import {
    runtimeMeasureEnd,
    runtimeMeasureStart,
} from "../../logger/runtimechecker";

const provider = new GoogleAuthProvider();

// Google 계정 선택창 항상 표시
provider.setCustomParameters({
    prompt: "select_account",
});

// 필요한 Scope 추가
provider.addScope("email");
provider.addScope("profile");

/**
 * Google Popup 로그인
 */
export async function SignInWithGooglePopup(): Promise<UserCredential> {
    try {
        runtimeMeasureStart("google-popup");

        logger("UserAuthService", "info", "Google Popup 로그인 시도...");

        const userCredential = await signInWithPopup(auth, provider);

        logger("UserAuthService", "info", "Google Popup 로그인 성공");

        runtimeMeasureEnd("google-popup");

        return userCredential;
    } catch (error: any) {
        logger(
            "UserAuthService",
            "error",
            "Google Popup 로그인 실패",
            error.message,
        );

        runtimeMeasureEnd("google-popup");
        throw error;
    }
}

/**
 * Google Redirect 로그인
 */
export async function SignInWithGoogleRedirect(): Promise<void> {
    try {
        runtimeMeasureStart("google-redirect");

        logger("UserAuthService", "info", "Google Redirect 로그인 시도...");

        await signInWithRedirect(auth, provider);

        // Redirect가 발생하므로 아래 코드는 실행되지 않음.
    } catch (error: any) {
        logger(
            "UserAuthService",
            "error",
            "Google Redirect 로그인 실패",
            error.message,
        );

        runtimeMeasureEnd("google-redirect");
        throw error;
    }
}

/**
 * Redirect 결과 처리
 */
export async function HandleGoogleRedirectResult(): Promise<UserCredential | null> {
    try {
        runtimeMeasureStart("google-result");

        const result = await getRedirectResult(auth);

        if (!result) {
            logger("UserAuthService", "info", "Redirect 결과가 없습니다.");

            runtimeMeasureEnd("google-result");

            return null;
        }

        logger("UserAuthService", "info", "Google Redirect 로그인 성공");

        runtimeMeasureEnd("google-result");

        return result;
    } catch (error: any) {
        logger(
            "UserAuthService",
            "error",
            "Redirect 결과 처리 실패",
            error.message,
        );

        runtimeMeasureEnd("google-result");
        throw error;
    }
}
