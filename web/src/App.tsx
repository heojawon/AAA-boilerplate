import { useEffect } from "react";

import { RouterProvider } from "react-router";
import router from "./router.tsx";
function App() {
    return <RouterProvider router={router} />;
}

export default App;

import CreateWithEmailAndPassword from "./utils/auth/create_delete/CreateUserWithEmailAndPassword";
import SignInWithEmailAndPassword from "./utils/auth/login/SignInWithEmailAndPassword";

import {
    HandleGoogleRedirectResult,
    SignInWithGooglePopup,
    SignInWithGoogleRedirect,
} from "./utils/auth/Provider/Google";

export function Main() {
    const email = "111@test.com";
    const password = "111111";

    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await HandleGoogleRedirectResult();

                if (result) {
                    console.log("Google Redirect 로그인 성공");
                    console.log(result.user);
                }
            } catch (error) {
                console.error("Google Redirect 처리 실패", error);
            }
        };

        checkRedirect();
    }, []);

    const handleCreate = async () => {
        try {
            const user = await CreateWithEmailAndPassword(email, password);

            console.log("회원가입 성공", user.user);
        } catch (error) {
            console.error("회원가입 실패", error);
        }
    };

    const handleLogin = async () => {
        try {
            const user = await SignInWithEmailAndPassword(email, password);

            console.log("로그인 성공", user.user);
        } catch (error) {
            console.error("로그인 실패", error);
        }
    };

    const handleGooglePopup = async () => {
        try {
            const result = await SignInWithGooglePopup();

            console.log("Google Popup 로그인 성공");
            console.log(result.user);
        } catch (error) {
            console.error("Google Popup 로그인 실패", error);
        }
    };

    const handleGoogleRedirect = async () => {
        try {
            await SignInWithGoogleRedirect();
        } catch (error) {
            console.error("Google Redirect 로그인 실패", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-6">
            <button
                onClick={handleCreate}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
            >
                테스트 회원가입
            </button>

            <button
                onClick={handleLogin}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
                테스트 로그인
            </button>

            <button
                onClick={handleGooglePopup}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
            >
                Google Popup 로그인
            </button>

            <button
                onClick={handleGoogleRedirect}
                className="rounded-lg bg-orange-500 px-4 py-2 text-white"
            >
                Google Redirect 로그인
            </button>
        </div>
    );
}
