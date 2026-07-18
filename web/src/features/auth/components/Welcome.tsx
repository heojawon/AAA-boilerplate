import React, { useState } from "react";
import SendPasswordResetEmail from "../../../utils/auth/login/SendPasswordResetEmail";
import { auth } from "../../../firebase/firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
    Mail,
    Lock,
    LogIn,
    ArrowRight,
    AlertCircle,
    RefreshCw,
    CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeProps {
    onStartSignUp: () => void;
    onLoginSuccess: (user: User) => void;
}

export default function Welcome({
    onStartSignUp,
    onLoginSuccess,
}: WelcomeProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    const [providerNotice, setProviderNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"login" | "reset">("login");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("이메일과 비밀번호를 모두 입력해 주세요.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            onLoginSuccess(userCredential.user);
        } catch (err: unknown) {
            console.error("Login error:", err);
            if (
                (err as { code?: string }).code === "auth/user-not-found" ||
                (err as { code?: string }).code === "auth/wrong-password" ||
                (err as { code?: string }).code === "auth/invalid-credential"
            ) {
                setError("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else if (
                (err as { code?: string }).code === "auth/invalid-email"
            ) {
                setError("유효하지 않은 이메일 형식입니다.");
            } else {
                setError(
                    "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("이메일 주소를 입력해 주세요.");
            return;
        }

        setError("");
        setResetSuccess("");
        setLoading(true);
        try {
            await SendPasswordResetEmail(email);
            setResetSuccess(
                "비밀번호 재설정 메일이 전송되었습니다. 메일함을 확인해 주세요.",
            );
        } catch (err: unknown) {
            console.error("Password reset error:", err);
            if ((err as { code?: string }).code === "auth/user-not-found") {
                setError("가입되지 않은 이메일입니다.");
            } else if (
                (err as { code?: string }).code === "auth/invalid-email"
            ) {
                setError("유효하지 않은 이메일 형식입니다.");
            } else {
                setError(
                    "메일 전송 중 오류가 발생했습니다. 다시 시도해 주세요.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setProviderNotice("");
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            onLoginSuccess(result.user);
        } catch (err: unknown) {
            console.error("Google auth error:", err);
            if ((err as { code?: string }).code === "auth/popup-blocked") {
                setError(
                    "브라우저에서 팝업이 차단되어 Google 로그인을 완료할 수 없어요.",
                );
                setProviderNotice(
                    "구글 로그인 이용이 불가능하면 아래 이메일 로그인으로 계속해 주세요.",
                );
            } else if (
                (err as { code?: string }).code ===
                "auth/network-request-failed"
            ) {
                setError(
                    "네트워크 연결이 불안정해 Google 로그인에 실패했어요.",
                );
                setProviderNotice(
                    "잠시 후 다시 시도하거나 아래 이메일 로그인으로 이어가 주세요.",
                );
            } else if (
                (err as { code?: string }).code !== "auth/popup-closed-by-user"
            ) {
                setError("Google 로그인에 실패했습니다.");
                setProviderNotice(
                    "구글 로그인 이용이 불가능하면 아래 이메일 로그인으로 계속해 주세요.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6"
            id="welcome-container"
        >
            <div className="w-full max-w-md space-y-8" id="welcome-content">
                {/* Brand Header */}
                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex p-4 rounded-3xl text-on-primary-container shadow-xl shadow-primary-container/20 mx-auto"
                    >
                        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-primary-light text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
                            M
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="font-display-lg text-4xl font-extrabold text-primary tracking-tight"
                    >
                        MoveUp
                    </motion.h1>

                    <motion.p
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed"
                    >
                        "최소한의 입력으로 시작하는 나만의 AI 맞춤형 웰니스"
                        일일 미션, 학교 랭킹, AI 코치와 함께 즐기는 건강 게임!
                    </motion.p>
                </div>

                {/* Login Form Box */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant shadow-lg relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {view === "login" ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleEmailLogin}
                                className="space-y-5"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                                        로그인
                                    </h3>
                                </div>

                                {error && (
                                    <div
                                        className="bg-error-container/20 border border-error/20 p-3.5 rounded-xl flex items-start gap-2.5 text-error text-xs font-body-md"
                                        id="login-error-box"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span className="leading-normal">
                                            {error}
                                        </span>
                                    </div>
                                )}

                                {providerNotice && (
                                    <div className="bg-amber-50/80 border border-amber-300/60 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-700 text-xs font-body-md">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span className="leading-normal">
                                            {providerNotice}
                                        </span>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface-variant">
                                        이메일 주소
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/70">
                                            <Mail className="h-4.5 w-4.5" />
                                        </span>
                                        <input
                                            id="login-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="name@school.com"
                                            className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xs font-label-md text-on-surface-variant">
                                            비밀번호
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setView("reset");
                                                setError("");
                                                setProviderNotice("");
                                            }}
                                            className="text-[10px] text-primary hover:underline font-label-md"
                                        >
                                            비밀번호를 잊으셨나요?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/70">
                                            <Lock className="h-4.5 w-4.5" />
                                        </span>
                                        <input
                                            id="login-password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="••••••••"
                                            className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 mt-2"
                                >
                                    {loading ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4" />
                                            <span>로그인 완료</span>
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="reset-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handlePasswordReset}
                                className="space-y-5"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                                        비밀번호 찾기
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView("login");
                                            setError("");
                                            setResetSuccess("");
                                        }}
                                        className="text-[10px] text-on-surface-variant hover:text-on-surface hover:underline font-label-md"
                                    >
                                        로그인으로 돌아가기
                                    </button>
                                </div>

                                <p className="text-xs text-on-surface-variant font-body-md leading-relaxed">
                                    가입하신 이메일 주소를 입력하시면 비밀번호
                                    재설정 링크를 보내드립니다.
                                </p>

                                {error && (
                                    <div className="bg-error-container/20 border border-error/20 p-3.5 rounded-xl flex items-start gap-2.5 text-error text-xs font-body-md">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span className="leading-normal">
                                            {error}
                                        </span>
                                    </div>
                                )}

                                {resetSuccess && (
                                    <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl flex items-start gap-2.5 text-primary-dark text-xs font-body-md">
                                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span className="leading-normal">
                                            {resetSuccess}
                                        </span>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface-variant">
                                        이메일 주소
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/70">
                                            <Mail className="h-4.5 w-4.5" />
                                        </span>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="name@school.com"
                                            className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !!resetSuccess}
                                    className="w-full bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50 mt-2"
                                >
                                    {loading ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4" />
                                            <span>
                                                비밀번호 재설정 메일 받기
                                            </span>
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Separator */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/60"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-surface-container-lowest px-2.5 text-on-surface-variant font-body-md">
                                또는
                            </span>
                        </div>
                    </div>

                    {/* Social Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-surface-container border border-outline-variant text-on-surface font-label-md text-xs py-3 rounded-full hover:bg-surface-container-high active:scale-98 transition-all flex items-center justify-center gap-2 mb-2"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.61 14.99 1 12 1 7.35 1 3.37 3.68 1.42 7.58l3.79 2.94C6.1 7.55 8.84 5.04 12 5.04z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.58 2.78c2.1-1.94 3.79-5.12 3.79-8.37z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.21 14.74c-.24-.71-.38-1.47-.38-2.74s.14-2.03.38-2.74L1.42 7.32C.51 9.11 0 11.12 0 13.26c0 2.14.51 4.15 1.42 5.94l3.79-2.94s0-.01 0-.02z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.58-2.78c-.99.66-2.26 1.06-3.79 1.06-3.16 0-5.9-2.51-6.79-6.48l-3.79 2.94C3.37 19.32 7.35 23 12 23z"
                            />
                        </svg>
                        <span>Google 계정으로 로그인</span>
                    </button>
                </motion.div>

                {/* Action to Sign Up */}
                <div
                    className="text-center font-body-md text-xs text-on-surface-variant flex items-center justify-center gap-1.5"
                    id="signup-prompt"
                >
                    <span>처음 오셨나요?</span>
                    <button
                        onClick={onStartSignUp}
                        className="text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                        <span>AI 맞춤 계정 만들기</span>
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
