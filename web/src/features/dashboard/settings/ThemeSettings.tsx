import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GetDocument from "../../../utils/db/CRUD/GetDocument";
import UpdateDocument from "../../../utils/db/CRUD/UpdateDocument";
import type { UserDocument } from "../../auth/types";
import { useNavigate } from "react-router";
import {
    Palette,
    Sparkles,
    Check,
    Zap,
    Moon,
    Sun,
    RefreshCw,
    HelpCircle,
} from "lucide-react";

interface ThemePreset {
    id: "light" | "dark" | "cosmic" | "forest" | "sunset" | "neon";
    name: string;
    description: string;
    primaryColor: string;
    bgColor: string;
    textColor: string;
    isDark: boolean;
}

type ThemeId = ThemePreset["id"];

const THEME_IDS: ThemeId[] = ["light", "dark", "cosmic", "forest", "sunset", "neon"];

function isThemeId(value: string): value is ThemeId {
    return (THEME_IDS as string[]).includes(value);
}

const THEME_PRESETS: ThemePreset[] = [
    {
        id: "light",
        name: "일반 라이트 (초록 포인트)",
        description:
            "부드러운 화이트와 싱그러운 에메랄드 그린(#10b981) 포인트 컬러의 만남",
        primaryColor: "bg-[#10b981]",
        bgColor: "bg-slate-50 border-slate-200",
        textColor: "text-slate-900",
        isDark: false,
    },
    {
        id: "dark",
        name: "일반 다크 (초록 포인트)",
        description:
            "눈이 편안한 딥 네이비 블랙과 싱그러운 에메랄드 그린(#10b981) 포인트 컬러의 조화",
        primaryColor: "bg-[#10b981]",
        bgColor: "bg-[#0b0f19] border-[#1e293b]",
        textColor: "text-slate-100",
        isDark: true,
    },
    {
        id: "cosmic",
        name: "코스믹 바이올렛",
        description: "우주적인 감성의 아늑한 퍼플 톤과 은하수 빛 레이아웃",
        primaryColor: "bg-[#8b5cf6]",
        bgColor: "bg-[#090514] border-[#1d0f3d]",
        textColor: "text-purple-50",
        isDark: true,
    },
    {
        id: "forest",
        name: "포레스트 에메랄드",
        description:
            "싱그러운 초록 숲속을 걷는 듯한 활기차고 자연 친화적인 무드",
        primaryColor: "bg-[#10b981]",
        bgColor: "bg-[#051610] border-[#124130]",
        textColor: "text-emerald-50",
        isDark: true,
    },
    {
        id: "sunset",
        name: "선셋 웜 피치",
        description:
            "붉게 물든 노을빛의 아늑하고 따스함이 가득 느껴지는 디자인",
        primaryColor: "bg-[#ea580c]",
        bgColor: "bg-[#fdf6f0] border-[#ffedd5]",
        textColor: "text-orange-950",
        isDark: false,
    },
    {
        id: "neon",
        name: "사이버 핑크 네온",
        description:
            "OLED 트루 블랙 스크린에 눈부신 핫핑크와 미래지향 네온 테마",
        primaryColor: "bg-[#ff007f]",
        bgColor: "bg-black border-[#222222]",
        textColor: "text-[#00ffff]",
        isDark: true,
    },
];

export default function ThemeSettings() {
    const navigate = useNavigate();
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTheme, setCurrentTheme] = useState<ThemeId>("cosmic");
    const [enableAnimations, setEnableAnimations] = useState(true);
    const [, setSaving] = useState(false);
    const [showDesc, setShowDesc] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                try {
                    const docSnap = await GetDocument("users", user.uid);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserDocument;
                        if (data.theme && isThemeId(data.theme)) {
                            setCurrentTheme(data.theme);
                        }
                        setEnableAnimations(data.enableAnimations !== false);
                    }
                } catch (err) {
                    console.error("Failed to load theme settings:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/auth");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Apply the selected theme to document.documentElement dynamically
    const handleThemeSelect = async (
        themeId: ThemeId,
    ) => {
        setCurrentTheme(themeId);
        setSaving(true);

        // Remove all other theme classes
        const root = document.documentElement;
        THEME_PRESETS.forEach((t) => {
            root.classList.remove(`theme-${t.id}`);
        });
        root.classList.add(`theme-${themeId}`);

        if (uid) {
            try {
                await UpdateDocument("users", uid, {
                    theme: themeId,
                });
            } catch (err) {
                console.error("Failed to update user theme on server:", err);
            }
        }
        setSaving(false);
    };

    const handleAnimationToggle = async () => {
        const newVal = !enableAnimations;
        setEnableAnimations(newVal);
        if (uid) {
            try {
                await UpdateDocument("users", uid, {
                    enableAnimations: newVal,
                });
            } catch (err) {
                console.error("Failed to update animation settings:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="text-headline-sm font-bold text-on-surface mb-1 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    디자인 테마 및 사용자 경험 설정
                    <button
                        type="button"
                        onClick={() => setShowDesc(!showDesc)}
                        className="text-on-surface-variant hover:text-primary transition-all p-1 rounded hover:bg-surface-container cursor-pointer ml-1"
                        title="설명 보기/숨기기"
                    >
                        <HelpCircle className="h-4.5 w-4.5" />
                    </button>
                </h2>
                {showDesc && (
                    <p className="text-body-md text-on-surface-variant bg-surface-container/30 p-2.5 rounded-xl border border-outline-variant/10 mt-1 animate-fade-in">
                        개인의 시력 상태나 디자인 기호에 맞춰, 6가지 고품격 테마
                        및 다크 모드 전환 환경을 설정할 수 있습니다.
                    </p>
                )}
            </div>

            {/* Dark Mode Quick Controls */}
            <div className="bg-surface-container/30 p-5 rounded-2xl border border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                        {THEME_PRESETS.find((t) => t.id === currentTheme)
                            ?.isDark ? (
                            <Moon className="h-4 w-4 text-primary" />
                        ) : (
                            <Sun className="h-4 w-4 text-amber-500" />
                        )}
                        빠른 테마 특성 정보
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                        현재 설정된{" "}
                        <strong className="text-primary">
                            "
                            {
                                THEME_PRESETS.find((t) => t.id === currentTheme)
                                    ?.name
                            }
                            "
                        </strong>{" "}
                        테마는{" "}
                        {THEME_PRESETS.find((t) => t.id === currentTheme)
                            ?.isDark
                            ? "다크(야간) 모드에"
                            : "라이트(주간) 모드에"}{" "}
                        특화된 테마입니다.
                    </p>
                </div>

                {/* Fast toggle between standard light & dark */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleThemeSelect("light")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${currentTheme === "light" ? "bg-primary text-on-primary shadow-sm" : "bg-surface hover:bg-surface-container text-on-surface-variant"}`}
                    >
                        <Sun className="h-3.5 w-3.5" />
                        라이트 모드
                    </button>
                    <button
                        onClick={() => handleThemeSelect("dark")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${currentTheme === "dark" ? "bg-primary text-on-primary shadow-sm" : "bg-surface hover:bg-surface-container text-on-surface-variant"}`}
                    >
                        <Moon className="h-3.5 w-3.5" />
                        다크 모드
                    </button>
                </div>
            </div>

            {/* Custom Theme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_PRESETS.map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    return (
                        <div
                            key={theme.id}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`group relative rounded-2xl p-5 border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between h-44 ${isSelected ? "border-primary bg-primary-container/10" : "border-outline-variant/10 bg-surface hover:border-outline-variant/30"}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                                        {theme.name}
                                        {isSelected && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed max-w-[85%]">
                                        {theme.description}
                                    </p>
                                </div>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high"} transition-colors shadow-sm`}
                                >
                                    {isSelected ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Sparkles className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
                                    )}
                                </div>
                            </div>

                            {/* Mini Theme Canvas Preview */}
                            <div
                                className={`mt-4 rounded-xl p-3 border ${theme.bgColor} flex items-center justify-between gap-4 font-sans text-xs shrink-0`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 rounded-full ${theme.primaryColor} shadow-inner`}
                                    ></div>
                                    <span
                                        className={`${theme.textColor} font-bold`}
                                    >
                                        MoveUp 프리뷰
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-6 h-3 rounded-sm bg-primary/20"></div>
                                    <div className="w-6 h-3 rounded-sm bg-primary/40"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* UX Animation Configurations */}
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-amber-500" />
                            인터랙션 부드러운 애니메이션 효과 활성화
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            메뉴 전환, 팝업, 퀘스트 완료 시 표시되는 모션
                            이벤트를 아름다운 모션 애니메이션으로 렌더링합니다.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAnimationToggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableAnimations ? "bg-primary" : "bg-outline-variant/50"}`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${enableAnimations ? "translate-x-5" : "translate-x-0"}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
