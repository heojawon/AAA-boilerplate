import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    User,
    Palette,
    LayoutGrid,
    Check,
    Sliders,
    Activity,
} from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import ThemeSettings from "./ThemeSettings";
import WidgetSettings from "./WidgetSettings";
import Footer from "../../../components/Footer";

export default function SettingsContainer() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"profile" | "theme" | "widget">(
        "profile",
    );

    // Floating toast alert simulation
    const [toast, setToast] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        const handleToast = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) {
                setToast({ text: detail.text, type: detail.type || "success" });
                setTimeout(() => setToast(null), 4000);
            }
        };

        window.addEventListener("toast-message", handleToast);
        return () => window.removeEventListener("toast-message", handleToast);
    }, []);

    const tabs = [
        {
            id: "profile",
            name: "프로필 & 일일 건강 목표",
            icon: User,
            color: "text-blue-500 bg-blue-500/10",
        },
        {
            id: "theme",
            name: "화면 테마 & 다크 모드",
            icon: Palette,
            color: "text-violet-500 bg-violet-500/10",
        },
        {
            id: "widget",
            name: "대시보드 위젯 배치",
            icon: LayoutGrid,
            color: "text-amber-500 bg-amber-500/10",
        },
    ] as const;

    return (
        <div className="bg-background min-h-screen flex flex-col font-sans transition-all duration-300">
            {/* Upper Header */}
            <header className="bg-surface border-b border-outline-variant/10 sticky top-0 z-50">
                <div className="flex justify-between items-center w-full px-6 md:px-8 h-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface p-2.5 rounded-full transition-all cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-on-surface leading-tight flex items-center gap-2">
                                <Sliders className="h-4 w-4 text-primary" />
                                개인 정보 및 환경 설정
                            </h1>
                            <p className="hidden sm:block text-3xs text-on-surface-variant">
                                MoveUp 통합 제어 환경설정 콘솔
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Status items removed per user request */}
                    </div>
                </div>
            </header>

            {/* Main Section */}
            <main className="grow max-w-7xl mx-auto w-full px-6 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
                {/* Lateral Navigation Sidebar */}
                <aside className="lg:w-64 shrink-0 space-y-2">
                    <div className="hidden lg:block bg-surface p-4 rounded-2xl border border-outline-variant/10 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-on-surface">
                                종합 환경 제어 센터
                            </span>
                        </div>
                        <p className="text-3xs text-on-surface-variant leading-relaxed">
                            사용자 데이터, 아바타, 위젯 레이아웃 등을 관리하여
                            최적의 동기 유발 대시보드를 생성합니다.
                        </p>
                    </div>

                    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar scroll-smooth">
                        {tabs.map((tab) => {
                            const isSelected = activeTab === tab.id;
                            const IconComp = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-left text-xs font-bold ${isSelected ? "bg-primary text-on-primary shadow-sm" : "bg-surface hover:bg-surface-container text-on-surface-variant"}`}
                                >
                                    <div
                                        className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-white/20 text-white" : tab.color}`}
                                    >
                                        <IconComp className="h-4 w-4" />
                                    </div>
                                    <span className="truncate">{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Sub-page Frame Container */}
                <section className="grow bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/10 shadow-xs relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.18 }}
                        >
                            {activeTab === "profile" && <ProfileSettings />}
                            {activeTab === "theme" && <ThemeSettings />}
                            {activeTab === "widget" && <WidgetSettings />}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </main>

            {/* Toasts alerting system */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-[100] max-w-sm"
                    >
                        <div className="bg-slate-900 border border-primary/20 p-4 rounded-2xl flex items-start gap-3 shadow-2xl text-slate-100">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">
                                    설정 저장 알림
                                </p>
                                <p className="text-2xs text-slate-300 mt-1 leading-relaxed">
                                    {toast.text}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
