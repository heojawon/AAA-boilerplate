import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import {
    onAuthStateChanged,
    signOut,
    type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { UserDocument } from "./types";
import Welcome from "./components/Welcome";
import SignUpWizard from "./components/SignUpWizard";
import Footer from "../../components/Footer";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

type AppView = "welcome" | "signup" | "dashboard";

export default function Auth() {
    window.document.title = "MoveUp - 계정 인증";
    const navigator = useNavigate();

    const [view, setView] = useState<AppView>("welcome");
    const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Keep track of authenticated google user who hasn't completed signup
    const [googleUser, setGoogleUser] = useState<{
        email: string;
        uid: string;
    } | null>(null);
    const [loadingStatus, setLoadingStatus] =
        useState("인증 시스템을 초기화하는 중...");
    const [showBypassBtn, setShowBypassBtn] = useState(false);

    useEffect(() => {
        console.log("App.tsx: Registering auth observer");
        setLoadingStatus("인증 세션을 확인하고 있습니다...");

        // Set a button display timeout if it takes too long
        const btnTimeout = setTimeout(() => {
            setShowBypassBtn(true);
            setLoadingStatus(
                "연결이 지연되고 있습니다. 직접 로그인 화면으로 가실 수 있습니다.",
            );
        }, 4000);

        const unsubscribe = onAuthStateChanged(
            auth,
            async (user: FirebaseUser | null) => {
                setAuthLoading(true);
                if (user) {
                    console.log(
                        "App.tsx: Authenticated user detected:",
                        user.uid,
                    );
                    setLoadingStatus("프로필 데이터를 불러오는 중...");

                    try {
                        // Wrap getDoc in a Promise.race to prevent indefinite hanging (timeout in 7.5s)
                        const docRef = doc(db, "users", user.uid);
                        const fetchPromise = getDoc(docRef);
                        const timeoutPromise = new Promise<null>((_, reject) =>
                            setTimeout(
                                () => reject(new Error("Timeout")),
                                7500,
                            ),
                        );

                        const docSnap = await Promise.race([
                            fetchPromise,
                            timeoutPromise,
                        ]);

                        if (docSnap && docSnap.exists()) {
                            console.log("App.tsx: Profile loaded successfully");
                            setUserDoc(docSnap.data() as UserDocument);
                            setView("dashboard");
                            setGoogleUser(null);
                        } else {
                            console.log(
                                "App.tsx: Profile not found, redirecting to signup",
                            );
                            setGoogleUser({
                                email: user.email || "",
                                uid: user.uid,
                            });
                            setView("signup");
                        }
                    } catch (err) {
                        console.error(
                            "App.tsx: Error loading user profile:",
                            err,
                        );
                        // If we failed to load profile but user is logged in, redirect them to welcome or signup to let them retry
                        setLoadingStatus(
                            "프로필을 불러오지 못했습니다. 새로 로그인해 주세요.",
                        );
                        setUserDoc(null);
                        setGoogleUser(null);
                        setView("welcome");
                    }
                } else {
                    console.log("App.tsx: No authenticated user");
                    setUserDoc(null);
                    setGoogleUser(null);
                    setView("welcome");
                }

                clearTimeout(btnTimeout);
                setAuthLoading(false);
            },
            (error) => {
                console.error("App.tsx: Auth observer error:", error);
                setLoadingStatus("인증 연결 중 오류가 발생했습니다.");
                setView("welcome");
                setAuthLoading(false);
            },
        );

        return () => {
            unsubscribe();
            clearTimeout(btnTimeout);
        };
    }, []);

    const handleLogout = async () => {
        setAuthLoading(true);
        setLoadingStatus("로그아웃 처리 중...");
        try {
            await signOut(auth);
            setUserDoc(null);
            setGoogleUser(null);
            setView("welcome");
        } catch (err) {
            console.error("Sign out error:", err);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignUpSuccess = (newUserDoc: UserDocument) => {
        setUserDoc(newUserDoc);
        setGoogleUser(null);
        setView("dashboard");
    };

    const handleLoginSuccess = async (user: FirebaseUser) => {
        setAuthLoading(true);
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDoc(docSnap.data() as UserDocument);
                setView("dashboard");
            } else {
                setGoogleUser({
                    email: user.email || "",
                    uid: user.uid,
                });
                setView("signup");
            }
        } catch (err) {
            console.error("Error during post-login redirect check:", err);
        } finally {
            setAuthLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div
                className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6"
                id="app-loading-screen"
            >
                <div className="text-center space-y-5 max-w-sm">
                    <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-display-lg text-2xl font-bold text-primary tracking-tight">
                            MoveUp
                        </h1>
                        <p className="font-body-md text-xs text-on-surface-variant transition-all duration-300">
                            {loadingStatus}
                        </p>
                    </div>

                    {showBypassBtn && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-2"
                        >
                            <button
                                onClick={() => {
                                    setAuthLoading(false);
                                    setView("welcome");
                                }}
                                className="bg-primary/10 text-primary font-label-md text-xs px-4 py-2 rounded-full hover:bg-primary/20 transition-all border border-primary/20"
                            >
                                직접 로그인 시작하기
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-background text-on-background"
            id="app-root-container"
        >
            <AnimatePresence mode="wait">
                {view === "welcome" && (
                    <motion.div
                        key="welcome-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Welcome
                            onStartSignUp={() => {
                                setGoogleUser(null);
                                setView("signup");
                            }}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    </motion.div>
                )}

                {view === "signup" && (
                    <motion.div
                        key="signup-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <SignUpWizard
                            googleUser={googleUser}
                            onCancel={() => {
                                if (googleUser) {
                                    // If they cancel Google onboard, log them out
                                    handleLogout();
                                } else {
                                    setView("welcome");
                                }
                            }}
                            onSuccess={handleSignUpSuccess}
                        />
                    </motion.div>
                )}

                {view === "dashboard" && userDoc && (
                    <motion.div
                        key="dashboard-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    ></motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
