import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../../firebase/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import GetDocument from "../../utils/db/CRUD/GetDocument";
import UpdateDocument from "../../utils/db/CRUD/UpdateDocument";
import type { UserDocument, DailyQuest, SchoolRank } from "../auth/types";
import Footer from "../../components/Footer";
import {
    RefreshCw,
    Settings,
    Flame,
    Sparkles,
    Award,
    TrendingUp,
    Footprints,
    Droplet,
    Moon,
    Plus,
    Minus,
    Calendar,
    BrainCircuit,
    Info,
    ChevronRight,
    Users,
    Utensils,
    CalendarCheck,
    Timer,
    Clock,
    X,
    CheckCircle,
    Check,
    HelpCircle,
    FlameKindling,
    BookOpen,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
} from "recharts";

const AVAILABLE_BADGES = [
    {
        id: "streak_3",
        title: "3일 연속 달성",
        icon: "🔥",
        desc: "3일 연속으로 오늘의 모든 퀘스트를 성공적으로 마쳤습니다.",
        color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    },
    {
        id: "first_10k",
        title: "첫 만보 걷기",
        icon: "🏃‍♂️",
        desc: "하루 10,000보 걷기를 달성하여 기초 체력 다지기를 시작했습니다.",
        color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    },
    {
        id: "tree_grow",
        title: "건강 나무 성장",
        icon: "🌲",
        desc: "건강 레벨 3에 도달해 울창한 나무를 가꾸게 되었습니다.",
        color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
];

// Mock Competing Schools Data
const MOCK_SCHOOLS: SchoolRank[] = [
    { name: "서울중학교", averageSteps: 8900, totalStudents: 142, rank: 1 },
    { name: "대구고등학교", averageSteps: 8120, totalStudents: 98, rank: 2 },
    { name: "부산중학교", averageSteps: 7450, totalStudents: 110, rank: 3 },
    { name: "광주중학교", averageSteps: 6980, totalStudents: 85, rank: 4 },
    { name: "인천고등학교", averageSteps: 6100, totalStudents: 124, rank: 5 },
];

export default function Dashboard() {
    // Synchronize current theme on startup
    useEffect(() => {
        const root = document.documentElement;
        const key = "users_mock-user-123";
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.theme) {
                    // Remove all theme classes and apply stored theme
                    const themes = [
                        "light",
                        "dark",
                        "cosmic",
                        "forest",
                        "sunset",
                        "neon",
                    ];
                    themes.forEach((t) => root.classList.remove(`theme-${t}`));
                    root.classList.add(`theme-${parsed.theme}`);
                }
            } catch (err) {
                console.error("Failed to load startup theme settings:", err);
            }
        } else {
            // Apply cosmic theme as default on first run
            root.classList.add("theme-cosmic");
        }
    }, []);

    const navigate = useNavigate();
    const [uid, setUid] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserDocument | null>(null);
    const [rankings, setRankings] = useState<UserDocument[]>([]);
    const [loading, setLoading] = useState(true);

    // AI Briefing State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiRec, setAiRec] = useState<string>("");
    const [aiError, setAiError] = useState<string>("");

    // Interactive Quest Modals/Detailed Subviews
    const [activeQuestWorkspace, setActiveQuestWorkspace] = useState<
        string | null
    >(null);

    // Water tracking locally
    const [localWater, setLocalWater] = useState<number>(0);
    // Custom steps input
    const [manualStepsInput, setManualStepsInput] = useState<string>("");

    // Help visibility toggle map
    const [visibleHelp, setVisibleHelp] = useState<Record<string, boolean>>({});
    const toggleHelp = (key: string) => {
        setVisibleHelp((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Stretching Timer State
    const [stretchTimerActive, setStretchTimerActive] = useState(false);
    const [stretchSecondsLeft, setStretchSecondsLeft] = useState(600); // 10 minutes = 600s
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Meal Logging State
    const [mealName, setMealName] = useState("");
    const [mealCalories, setMealCalories] = useState("");
    const [mealType, setMealType] = useState<
        "breakfast" | "lunch" | "dinner" | "snack"
    >("breakfast");

    // AI Meal Coaching State
    const [coachingText, setCoachingText] = useState<string>("");
    const [coachingLoading, setCoachingLoading] = useState<boolean>(false);

    // AI-generated daily synchronized quests state
    const [dynamicQuests, setDynamicQuests] = useState<any>(null);

    useEffect(() => {
        const fetchDailyQuests = async () => {
            try {
                const res = await fetch("/api/quests");
                if (res.ok) {
                    const data = await res.json();
                    if (data.quests) {
                        setDynamicQuests(data.quests);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch daily synced quests:", err);
            }
        };
        fetchDailyQuests();
    }, []);

    // Dynamic toast alerts
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        type: "success" | "error" | "info";
    } | null>(null);

    const triggerToast = (
        text: string,
        type: "success" | "error" | "info" = "success",
    ) => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Listen for outer updates (e.g. from Settings Profile edits)
    useEffect(() => {
        const handleDbUpdate = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail && detail.id === uid && detail.collection === "users") {
                setUserData(detail.data);
                if (detail.data.waterGlasses !== undefined) {
                    setLocalWater(detail.data.waterGlasses);
                }
            }
        };
        window.addEventListener("local-db-updated", handleDbUpdate);

        const handleToastEvent = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail && detail.text) {
                triggerToast(detail.text, detail.type || "success");
            }
        };
        window.addEventListener("toast-message", handleToastEvent);

        return () => {
            window.removeEventListener("local-db-updated", handleDbUpdate);
            window.removeEventListener("toast-message", handleToastEvent);
        };
    }, [uid]);

    // Stretching Countdown interval hook
    useEffect(() => {
        if (stretchTimerActive) {
            timerIntervalRef.current = setInterval(() => {
                setStretchSecondsLeft((prev) => {
                    if (prev <= 1) {
                        setStretchTimerActive(false);
                        clearInterval(timerIntervalRef.current!);
                        handleCompleteStretchQuest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [stretchTimerActive]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Load Data
    const loadDashboardData = async (userUid: string) => {
        try {
            const docSnap = await GetDocument("users", userUid);
            if (docSnap.exists()) {
                const data = docSnap.data() as UserDocument;
                setUserData(data);
                setLocalWater(data.waterGlasses || 0);

                // Set theme initially on mount
                if (data.theme) {
                    const root = document.documentElement;
                    // Clean other theme prefixes
                    const themeClasses = Array.from(root.classList).filter(
                        (c) => c.startsWith("theme-"),
                    );
                    themeClasses.forEach((c) => root.classList.remove(c));
                    root.classList.add(`theme-${data.theme}`);
                }

                // Check today's date
                const todayStr = new Date().toISOString().split("T")[0];

                // Automatically retrieve or reuse cached AI briefing
                if (
                    data.aiBriefingCache &&
                    data.aiBriefingCache.date === todayStr
                ) {
                    setAiRec(data.aiBriefingCache.text);
                } else {
                    // Automatically generate without explicit user request
                    generateAIBriefing(data, todayStr);
                }
            }

            // Fetch top rankings
            const q = query(
                collection(db, "users"),
                orderBy("todaySteps", "desc"),
                limit(5),
            );
            const querySnapshot = await getDocs(q);
            const ranks: UserDocument[] = [];
            querySnapshot.forEach((doc) => {
                ranks.push(doc.data() as UserDocument);
            });
            setRankings(ranks);
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Generates AI briefing once and caches it to Firestore
    const generateAIBriefing = async (
        userDoc: UserDocument,
        todayStr: string,
    ) => {
        setAiLoading(true);
        setAiError("");
        try {
            const res = await fetch("/api/recommendation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nickname: userDoc.nickname || "학생 사용자",
                    healthGoal:
                        userDoc.healthGoal || "기초 체력을 기르고 싶어요",
                    todaySteps: userDoc.todaySteps || 0,
                    targetSteps: userDoc.targetSteps || 8000,
                    completedQuests: userDoc.completedQuests || [],
                    sleepTarget: userDoc.sleepTarget || 8,
                    waterTarget: userDoc.waterTarget || 8,
                    dietPreference: userDoc.dietPreference || "balanced",
                    mealLogs: userDoc.mealLogs || [],
                    height: userDoc.height || 165,
                    weight: userDoc.weight || 55,
                    studyHours: userDoc.studyHours || 4,
                }),
            });

            if (!res.ok) {
                throw new Error("AI 분석을 수행하지 못했습니다.");
            }

            const payload = await res.json();
            const text = payload.recommendation || "";
            setAiRec(text);

            // Save in DB Cache so we reuse it
            if (uid) {
                await UpdateDocument("users", uid, {
                    aiBriefingCache: {
                        date: todayStr,
                        text: text,
                    },
                });
            }
        } catch (err) {
            console.error("AI briefing generation error:", err);
            setAiError(
                "가벼운 웰니스 추천 브리핑을 수립하는 데 오차가 생겼습니다.",
            );
            setAiRec(
                "💡 [안내] 가벼운 반신욕을 즐기고, 오늘 섭취 칼로리에 상응하는 가벼운 제자리 걷기를 15분 이어가 보세요!",
            );
        } finally {
            setAiLoading(false);
        }
    };

    // Calculate Health Score
    const recalculateHealthScore = async (
        steps: number,
        target: number,
        completed: string[],
        meals: any[],
    ) => {
        if (!uid || !userData) return;

        const stepsProgress = Math.min((steps / target) * 100, 100);
        const questProgress = Math.min((completed.length / 4) * 100, 100);

        // Calories score calculation (healthy ratio around 1200 - 2200 kcal for general teenagers)
        const totalCals = meals
            ? meals.reduce((acc, i) => acc + (Number(i.calories) || 0), 0)
            : 0;
        let mealScore = 100;
        if (totalCals > 2500)
            mealScore = Math.max(40, 100 - (totalCals - 2500) / 10);
        else if (totalCals < 1000)
            mealScore = Math.max(50, 100 - (1000 - totalCals) / 10);

        // Score ratio: 30% Steps + 45% Quests + 25% Meal score
        const newScore = Math.round(
            stepsProgress * 0.3 + questProgress * 0.45 + mealScore * 0.25,
        );

        let newLevel = userData.level || 1;
        let newExp = userData.experience || 0;

        if (newScore > 90) newLevel = 4;
        else if (newScore > 75) newLevel = 3;
        else if (newScore > 40) newLevel = 2;
        else newLevel = 1;

        // Badges calculation
        const newBadges = [...(userData.badges || [])];
        if (steps >= 10000 && !newBadges.includes("first_10k")) {
            newBadges.push("first_10k");
            triggerToast("🎉 새 배지 획득: '첫 만보 걷기'!", "success");
        }
        if (newLevel >= 3 && !newBadges.includes("tree_grow")) {
            newBadges.push("tree_grow");
            triggerToast("🎉 새 배지 획득: '건강 나무 성장'!", "success");
        }
        if ((userData.streak || 0) >= 3 && !newBadges.includes("streak_3")) {
            newBadges.push("streak_3");
            triggerToast("🎉 새 배지 획득: '3일 연속 달성'!", "success");
        }

        const updatedData = {
            ...userData,
            healthScore: newScore,
            level: newLevel,
            badges: newBadges,
        };

        setUserData(updatedData);

        try {
            await UpdateDocument("users", uid, {
                healthScore: newScore,
                level: newLevel,
                badges: newBadges,
            });
        } catch (err) {
            console.error("Failed to save recalculated score:", err);
        }
    };

    // Toggle quests manually or dynamically
    const handleQuestToggle = async (
        questId: string,
        forceStatus?: boolean,
    ) => {
        if (!uid || !userData) return;

        const isCompleted = userData.completedQuests?.includes(questId);
        let newCompletedQuests = userData.completedQuests || [];

        const targetStatus =
            forceStatus !== undefined ? forceStatus : !isCompleted;

        if (!targetStatus) {
            newCompletedQuests = newCompletedQuests.filter(
                (q) => q !== questId,
            );
        } else {
            if (!newCompletedQuests.includes(questId)) {
                newCompletedQuests = [...newCompletedQuests, questId];
                // Award experience
                const currentExp = userData.experience || 0;
                const newExp = currentExp + 15;
                let newLevel = userData.level || 1;
                triggerToast("🎁 퀘스트 완료! +15 EXP 획득", "success");
                await UpdateDocument("users", uid, { experience: newExp });
            }
        }

        const targetSteps = userData.targetSteps || 8000;
        const currentSteps = userData.todaySteps || 0;

        setUserData({ ...userData, completedQuests: newCompletedQuests });

        try {
            await UpdateDocument("users", uid, {
                completedQuests: newCompletedQuests,
            });
            recalculateHealthScore(
                currentSteps,
                targetSteps,
                newCompletedQuests,
                userData.mealLogs || [],
            );
        } catch (err) {
            console.error("Failed to update quest:", err);
        }
    };

    // Attendance Checking Logic
    const handleAttendanceCheckIn = async () => {
        if (!uid || !userData) return;

        const todayStr = new Date().toISOString().split("T")[0];
        const currentAttendance = userData.attendance || [];

        if (currentAttendance.includes(todayStr)) {
            triggerToast("이미 오늘 출석 체크를 하셨습니다!", "info");
            return;
        }

        const newAttendance = [...currentAttendance, todayStr];

        // Calculate Streak: Check if yesterday was also checked in
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = userData.streak || 0;
        if (
            currentAttendance.includes(yesterdayStr) ||
            currentAttendance.length === 0
        ) {
            newStreak += 1;
        } else {
            newStreak = 1; // reset or start at 1
        }

        // Award +25 EXP
        const newExp = (userData.experience || 0) + 25;
        let newLevel = userData.level || 1;
        if (newExp >= 100) {
            newLevel += 1;
            triggerToast(
                `🎊 축하합니다! 레벨 ${newLevel}로 상승했습니다!`,
                "success",
            );
        }

        const updated = {
            ...userData,
            attendance: newAttendance,
            streak: newStreak,
            experience: newExp % 100,
            level: newLevel,
        };

        setUserData(updated);
        triggerToast(
            "📅 오늘의 출석 체크 완료! +25 EXP 및 일일 스트릭 보너스 획득!",
            "success",
        );

        try {
            await UpdateDocument("users", uid, {
                attendance: newAttendance,
                streak: newStreak,
                experience: newExp % 100,
                level: newLevel,
            });
        } catch (err) {
            console.error("Failed to update attendance:", err);
        }
    };

    // 1. Walk Quest Workspace Step Additions
    const handleAddManualSteps = async (amountStr?: string) => {
        if (!uid || !userData) return;

        let stepsToAdd = 0;
        if (amountStr) {
            stepsToAdd = parseInt(amountStr);
        } else {
            stepsToAdd = parseInt(manualStepsInput);
            if (isNaN(stepsToAdd) || stepsToAdd <= 0) {
                triggerToast("올바른 걸음 수를 정수로 입력해 주세요.", "error");
                return;
            }
        }

        const currentSteps = userData.todaySteps || 0;
        const newSteps = currentSteps + stepsToAdd;
        const targetSteps = userData.targetSteps || 8000;
        const completed = userData.completedQuests || [];

        // Auto check walking quest if threshold met
        let updatedQuests = [...completed];
        if (newSteps >= targetSteps && !completed.includes("q_steps")) {
            updatedQuests.push("q_steps");
            triggerToast("🎉 걸음 수 목표 완수!", "success");
        }

        setUserData({
            ...userData,
            todaySteps: newSteps,
            completedQuests: updatedQuests,
        });
        setManualStepsInput("");

        try {
            await UpdateDocument("users", uid, {
                todaySteps: newSteps,
                completedQuests: updatedQuests,
            });

            // Recalculate health score
            recalculateHealthScore(
                newSteps,
                targetSteps,
                updatedQuests,
                userData.mealLogs || [],
            );
            triggerToast(
                `👟 ${stepsToAdd.toLocaleString()}걸음이 성공적으로 기록되었습니다!`,
                "success",
            );
        } catch (err) {
            console.error("Failed to record manual steps:", err);
        }
    };

    // 2. Water Quest Increase / Decrease
    const handleUpdateWater = async (increment: boolean) => {
        if (!uid || !userData) return;

        const currentWater = localWater;
        const targetWater = userData.waterTarget || 8;
        const nextWater = increment
            ? currentWater + 1
            : Math.max(0, currentWater - 1);

        setLocalWater(nextWater);
        const completed = userData.completedQuests || [];

        let updatedQuests = [...completed];
        if (nextWater >= targetWater) {
            if (!completed.includes("q_water")) {
                updatedQuests.push("q_water");
                triggerToast("💧 물 섭취 목표 퀘스트 달성!", "success");
            }
        } else {
            updatedQuests = updatedQuests.filter((q) => q !== "q_water");
        }

        setUserData({
            ...userData,
            waterGlasses: nextWater,
            completedQuests: updatedQuests,
        });

        try {
            await UpdateDocument("users", uid, {
                waterGlasses: nextWater,
                completedQuests: updatedQuests,
            });
            recalculateHealthScore(
                userData.todaySteps || 0,
                userData.targetSteps || 8000,
                updatedQuests,
                userData.mealLogs || [],
            );
        } catch (err) {
            console.error("Failed to update water intake:", err);
        }
    };

    // 3. Stretching Timer completion
    const handleCompleteStretchQuest = async () => {
        if (!uid || !userData) return;
        const completed = userData.completedQuests || [];
        if (!completed.includes("q_stretch")) {
            const updatedQuests = [...completed, "q_stretch"];
            setUserData({ ...userData, completedQuests: updatedQuests });
            try {
                await UpdateDocument("users", uid, {
                    completedQuests: updatedQuests,
                });
                recalculateHealthScore(
                    userData.todaySteps || 0,
                    userData.targetSteps || 8000,
                    updatedQuests,
                    userData.mealLogs || [],
                );
                triggerToast(
                    "🧘 10분 스트레칭 완료! 어깨 통증과 자세가 리프레시되었습니다.",
                    "success",
                );
            } catch (err) {
                console.error("Failed to update stretching quest:", err);
            }
        }
        setStretchSecondsLeft(600);
        setStretchTimerActive(false);
    };

    // 4. Meal logger add/remove
    const handleAddMealLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uid || !userData) return;

        if (!mealName.trim() || !mealCalories) {
            triggerToast("식사 명칭과 칼로리(kcal)를 입력하세요.", "error");
            return;
        }

        const newMeal = {
            id: Math.random().toString(36).substr(2, 9),
            type: mealType,
            name: mealName.trim(),
            calories: Number(mealCalories),
            timestamp: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
        };

        const currentMeals = userData.mealLogs || [];
        const updatedMeals = [...currentMeals, newMeal];

        // Optimistically update
        const completed = userData.completedQuests || [];
        setUserData({ ...userData, mealLogs: updatedMeals });

        setMealName("");
        setMealCalories("");

        try {
            await UpdateDocument("users", uid, { mealLogs: updatedMeals });
            recalculateHealthScore(
                userData.todaySteps || 0,
                userData.targetSteps || 8000,
                completed,
                updatedMeals,
            );
            triggerToast(
                `🍽️ '${newMeal.name}' 식사가 성공적으로 등재되었습니다!`,
                "success",
            );
        } catch (err) {
            console.error("Failed to add meal log:", err);
        }
    };

    const handleDeleteMealLog = async (mealId: string) => {
        if (!uid || !userData) return;

        const currentMeals = userData.mealLogs || [];
        const updatedMeals = currentMeals.filter((m) => m.id !== mealId);

        setUserData({ ...userData, mealLogs: updatedMeals });

        try {
            await UpdateDocument("users", uid, { mealLogs: updatedMeals });
            recalculateHealthScore(
                userData.todaySteps || 0,
                userData.targetSteps || 8000,
                userData.completedQuests || [],
                updatedMeals,
            );
            triggerToast("식단 항목이 삭제되었습니다.", "info");
        } catch (err) {
            console.error("Failed to delete meal log:", err);
        }
    };

    const handleGetMealCoaching = async () => {
        if (!uid || !userData) return;
        setCoachingLoading(true);
        try {
            const res = await fetch("/api/meal-coaching", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nickname: userData.nickname || "학생",
                    gender: userData.gender || "none",
                    height: userData.height || 165,
                    weight: userData.weight || 55,
                    mealLogs: userData.mealLogs || [],
                    recommendedCalories:
                        userData.gender === "male"
                            ? 2400
                            : userData.gender === "female"
                              ? 2000
                              : 2200,
                    healthGoal:
                        userData.healthGoal || "기초 체력을 기르고 싶어요",
                }),
            });

            if (!res.ok) throw new Error("API 요청에 실패하였습니다.");
            const data = await res.json();
            setCoachingText(data.coaching || "식단을 분석하지 못했습니다.");
            triggerToast("🤖 AI 영양사 분석 코칭 완료!", "success");
        } catch (err) {
            console.error("AI meal coaching error:", err);
            triggerToast("코칭을 불러오는 데 실패하였습니다.", "error");
        } finally {
            setCoachingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs text-on-surface-variant mt-3 font-mono">
                    MoveUp 대시보드 불러오는 중...
                </p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-on-surface">
                <Info className="h-10 w-10 text-primary mb-3" />
                대시보드 데이터를 불러오지 못했습니다.
                <button
                    onClick={() => navigate("/auth")}
                    className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full text-xs cursor-pointer"
                >
                    인증 화면으로 이동
                </button>
            </div>
        );
    }

    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${["일", "월", "화", "수", "목", "금", "토"][today.getDay()]}요일`;

    const targetSteps = userData.targetSteps || 8000;
    const currentSteps = userData.todaySteps || 0;
    const completedQuests = userData.completedQuests || [];
    const userBadges = userData.badges || [];
    const stepsProgress = Math.min((currentSteps / targetSteps) * 100, 100);

    const mealLogs = userData.mealLogs || [];
    const totalMealCalories = mealLogs.reduce(
        (acc, m) => acc + (Number(m.calories) || 0),
        0,
    );
    const recommendedCalories =
        userData.gender === "male"
            ? 2400
            : userData.gender === "female"
              ? 2000
              : 2200;

    // Check if attended today
    const todayStr = new Date().toISOString().split("T")[0];
    const isAttendedToday = userData.attendance?.includes(todayStr) || false;

    // Daily active quests objects
    const questItems = [
        {
            id: "q_steps",
            title: dynamicQuests?.q_steps?.title || "일일 걸음 수 목표 달성",
            desc:
                dynamicQuests?.q_steps?.desc ||
                `${currentSteps.toLocaleString()} / ${targetSteps.toLocaleString()} 걸음`,
            icon: dynamicQuests?.q_steps?.icon || "👟",
            colorClass:
                dynamicQuests?.q_steps?.colorClass || "text-emerald-500",
            bgClass: dynamicQuests?.q_steps?.bgClass || "bg-emerald-500/10",
            buttonLabel: "걸음 수 직접 기록",
        },
        {
            id: "q_water",
            title:
                dynamicQuests?.q_water?.title ||
                `충분한 수분 마시기 (목표: ${userData.waterTarget || 8}잔)`,
            desc:
                dynamicQuests?.q_water?.desc || `오늘 마신 물: ${localWater}잔`,
            icon: dynamicQuests?.q_water?.icon || "💧",
            colorClass: dynamicQuests?.q_water?.colorClass || "text-sky-400",
            bgClass: dynamicQuests?.q_water?.bgClass || "bg-sky-500/10",
            buttonLabel: "수분 마시기 상세 기록",
        },
        {
            id: "q_stretch",
            title:
                dynamicQuests?.q_stretch?.title || "목/어깨 이완 스트레칭 10분",
            desc:
                dynamicQuests?.q_stretch?.desc ||
                "앉아서 학업 중 틈틈이 피로 해소",
            icon: dynamicQuests?.q_stretch?.icon || "🧘",
            colorClass:
                dynamicQuests?.q_stretch?.colorClass || "text-violet-400",
            bgClass: dynamicQuests?.q_stretch?.bgClass || "bg-violet-500/10",
            buttonLabel: "자세이완 타이머 열기",
        },
        {
            id: "q_exercise",
            title:
                dynamicQuests?.q_exercise?.title ||
                `신체 활동 완료 (목표: ${userData.targetExerciseMinutes || 40}분)`,
            desc: dynamicQuests?.q_exercise?.desc || `오늘 강도 높은 운동 시간`,
            icon: dynamicQuests?.q_exercise?.icon || "🏋️‍♂️",
            colorClass:
                dynamicQuests?.q_exercise?.colorClass || "text-rose-400",
            bgClass: dynamicQuests?.q_exercise?.bgClass || "bg-rose-500/10",
            buttonLabel: "활동 시간 기록",
        },
    ];

    // Attendance dates list preview
    const renderAttendanceDays = () => {
        const daysToShow = [];
        const todayCopy = new Date();
        // Go back 6 days to show a 7-day rolling check-in window
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(todayCopy.getDate() - i);
            daysToShow.push(d);
        }

        return daysToShow.map((date) => {
            const dStr = date.toISOString().split("T")[0];
            const isChecked = userData.attendance?.includes(dStr);
            const isTodayItem = dStr === todayStr;
            const label = date.getDate();
            const dayLabel = ["일", "월", "화", "수", "목", "금", "토"][
                date.getDay()
            ];

            return (
                <div
                    key={dStr}
                    className="flex flex-col items-center gap-1 shrink-0"
                >
                    <span className="text-4xs text-on-surface-variant font-medium">
                        {dayLabel}
                    </span>
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${
                            isChecked
                                ? "bg-primary text-on-primary border-primary shadow-xs"
                                : isTodayItem
                                  ? "border-primary text-primary bg-primary/5 ring-1 ring-primary"
                                  : "bg-surface-container border-outline-variant/10 text-on-surface-variant"
                        }`}
                        title={dStr}
                    >
                        {isChecked ? (
                            <Check className="h-4 w-4 stroke-[3px]" />
                        ) : (
                            <span>{label}</span>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="bg-background min-h-screen flex flex-col font-sans transition-all duration-300">
            {/* Custom Interactive Toast Messages */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold shadow-xl border border-outline-variant/10 bg-surface text-on-surface"
                    >
                        {toastMessage.type === "success" ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                        ) : toastMessage.type === "info" ? (
                            <Info className="h-4 w-4 text-sky-400" />
                        ) : (
                            <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>{toastMessage.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upper Navigation Header */}
            <header className="bg-surface border-b border-outline-variant/10 sticky top-0 z-40">
                <div className="flex justify-between items-center w-full px-6 md:px-8 h-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-extrabold text-sm">
                            M
                        </div>
                        <span className="text-xl font-black tracking-tight text-primary">
                            MoveUp
                        </span>
                    </div>

                    <nav className="hidden md:flex gap-8">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-primary font-bold border-b-2 border-primary pb-1 text-xs cursor-pointer"
                        >
                            홈 대시보드
                        </button>
                        <button
                            onClick={() => navigate("/settings")}
                            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold cursor-pointer"
                        >
                            상세 설정
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/settings")}
                            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-all shrink-0 cursor-pointer text-on-surface border border-outline-variant/10"
                            title="환경 설정"
                        >
                            <Settings className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => navigate("/settings")}
                            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/10 hover:border-primary transition-all shrink-0 cursor-pointer"
                            title="내 정보 프로필 관리"
                        >
                            <img
                                alt="사용자 아바타"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                src={
                                    userData.profileImage ||
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8D0EG3xwoVY7hPXLqUiF14nEDmGi-5PLIbGsiuwQxV950-VRtcTJbVtDVyLOGpy9Yn210k-a7OvKYB3dKRR_s0Z7Kqql0E0Emskjekd6YWFRAM0SAdtFys1Vw-tPI8wjTMRKwJbHIQRsbEfqQjBG-tieLbxNp_nOMT3gaBhBMBWOGz0XGLA0wMkDxn5I7BVSZZUjePRSjcXPUN_zcuhNlEySVu5Xv2zA_hPMyPotlIFlOuQgzZVSaIoKYZWe1iqq_HRGNRfYtgff"
                                }
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Canvas Dashboard */}
            <main className="grow max-w-7xl mx-auto w-full px-6 md:px-8 py-6 space-y-6">
                {/* Greeting Banner */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-5">
                    <div>
                        <p className="text-xs font-mono text-on-surface-variant tracking-wider uppercase mb-1">
                            {dateString}
                        </p>
                        <h1 className="text-xl md:text-2xl font-black text-on-surface leading-snug tracking-tight">
                            안녕하세요,{" "}
                            <span className="text-primary">
                                {userData.nickname || "사용자"}
                            </span>
                            님! 👋
                            <br />
                            건강 수치 지수{" "}
                            <span className="text-primary font-black">
                                {userData.healthScore || 0}점
                            </span>
                            , 꾸준한 출석과 식단으로 무장해 보세요!
                        </h1>
                    </div>
                </section>

                {/* AI Briefing - Always displayed cleanly & cached */}
                <section className="bg-surface rounded-2xl p-5 border border-outline-variant/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-6.5 h-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/25">
                            <BrainCircuit className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="text-xs font-black text-on-surface">
                            AI 웰니스 요약 퀵 브리핑
                        </h3>
                        {aiLoading && (
                            <RefreshCw className="h-3 w-3 text-primary animate-spin ml-1" />
                        )}
                    </div>
                    <div className="bg-surface-container/20 border border-outline-variant/10 rounded-xl p-3">
                        {aiLoading ? (
                            <p className="text-4xs text-on-surface-variant animate-pulse">
                                오늘의 건강 요소를 바탕으로 최적의 2줄 팩트
                                브리핑을 조립 중입니다...
                            </p>
                        ) : (
                            <p className="text-xs text-on-surface leading-relaxed text-left font-medium">
                                {aiRec ||
                                    "💡 물을 꾸준히 마시고 오늘 퀘스트를 체크하여 일상 피로감을 극복하세요!"}
                            </p>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-12 gap-5">
                    {/* Attendance checkin bento box */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface border border-outline-variant/10 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-76">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                    <CalendarCheck className="h-4 w-4 text-primary" />
                                    매일 출석체크 습관
                                    <button
                                        onClick={() =>
                                            toggleHelp("attendanceHelp")
                                        }
                                        className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                        title="설명 보기/숨기기"
                                        type="button"
                                    >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                    </button>
                                </h3>
                                <span className="text-3xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                                    🔥 {userData.streak || 0}일 연속
                                </span>
                            </div>
                            {visibleHelp["attendanceHelp"] && (
                                <p className="text-4xs text-on-surface-variant leading-relaxed bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 mb-2 animate-fade-in">
                                    매일 로그인 후 출석을 눌러 +25 EXP 경험치를
                                    획득하고 레벨업 성장을 이루세요!
                                </p>
                            )}
                        </div>

                        {/* rolling week grid */}
                        <div className="flex justify-between gap-1 overflow-x-auto py-2">
                            {renderAttendanceDays()}
                        </div>

                        <button
                            onClick={handleAttendanceCheckIn}
                            disabled={isAttendedToday}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                                isAttendedToday
                                    ? "bg-surface-container text-on-surface-variant cursor-not-allowed border border-outline-variant/10"
                                    : "bg-primary hover:bg-primary/95 text-on-primary"
                            }`}
                        >
                            {isAttendedToday ? (
                                <>
                                    <Check className="h-3.5 w-3.5" />
                                    <span>오늘 출석 완료</span>
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>오늘 출석하고 +25 EXP 획득</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Calorie Nutrition Board */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface border border-outline-variant/10 rounded-2xl p-5 flex flex-col shadow-xs min-h-76 h-auto justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5 border-b border-outline-variant/10 pb-2">
                                <Utensils className="h-4 w-4 text-primary" />
                                일일 식단 칼로리 플래너
                                <button
                                    onClick={() =>
                                        toggleHelp("mealPlannerHelp")
                                    }
                                    className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                    title="설명 보기/숨기기"
                                    type="button"
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                            </h3>
                            {visibleHelp["mealPlannerHelp"] && (
                                <p className="text-4xs text-on-surface-variant bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 my-1 animate-fade-in leading-relaxed">
                                    오늘 섭취한 식사 칼로리를 트래킹하고 AI
                                    영양사 분석을 통해 맞춤 영양 코칭을
                                    받습니다.
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-4 my-2 shrink-0">
                                <div className="bg-surface-container/30 rounded-xl p-2.5 border border-outline-variant/5">
                                    <span className="text-4xs text-on-surface-variant block mb-0.5 font-bold">
                                        권장 권장량
                                    </span>
                                    <span className="text-sm font-black text-on-surface">
                                        {recommendedCalories}{" "}
                                        <span className="text-4xs font-normal">
                                            kcal
                                        </span>
                                    </span>
                                </div>
                                <div className="bg-surface-container/30 rounded-xl p-2.5 border border-outline-variant/5">
                                    <span className="text-4xs text-primary block mb-0.5 font-bold">
                                        오늘 섭취량
                                    </span>
                                    <span
                                        className={`text-sm font-black ${totalMealCalories > recommendedCalories ? "text-red-500" : "text-primary"}`}
                                    >
                                        {totalMealCalories}{" "}
                                        <span className="text-4xs font-normal">
                                            kcal
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1 my-1 shrink-0">
                                <div className="flex justify-between text-4xs text-on-surface-variant">
                                    <span>섭취 비율</span>
                                    <span>
                                        {Math.round(
                                            (totalMealCalories /
                                                recommendedCalories) *
                                                100,
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/5">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${totalMealCalories > recommendedCalories ? "bg-red-500" : "bg-primary"}`}
                                        style={{
                                            width: `${Math.min(100, (totalMealCalories / recommendedCalories) * 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Fast Logging Button View */}
                            <div className="grow overflow-y-auto mt-2 pr-1 space-y-1 max-h-24 scrollbar-thin">
                                {mealLogs.length === 0 ? (
                                    <p className="text-4xs text-on-surface-variant text-center py-4">
                                        아직 오늘의 식사 기록이 없습니다.
                                    </p>
                                ) : (
                                    mealLogs.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex justify-between items-center bg-surface-container/30 p-1.5 rounded-lg border border-outline-variant/5 text-4xs"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-1 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                                                    {meal.type === "breakfast"
                                                        ? "아침"
                                                        : meal.type === "lunch"
                                                          ? "점심"
                                                          : meal.type ===
                                                              "dinner"
                                                            ? "저녁"
                                                            : "간식"}
                                                </span>
                                                <span className="font-bold text-on-surface">
                                                    {meal.name}
                                                </span>
                                                <span className="text-on-surface-variant text-3xs font-mono">
                                                    {meal.timestamp}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-black text-on-surface">
                                                    {meal.calories} kcal
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMealLog(
                                                            meal.id,
                                                        )
                                                    }
                                                    className="text-on-surface-variant hover:text-red-500 p-0.5 transition-all cursor-pointer"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 mt-3">
                            {/* Add Food trigger form */}
                            <form
                                onSubmit={handleAddMealLog}
                                className="grid grid-cols-12 gap-1.5 pt-2 border-t border-outline-variant/10 shrink-0"
                            >
                                <select
                                    value={mealType}
                                    onChange={(e) =>
                                        setMealType(e.target.value as any)
                                    }
                                    className="col-span-3 bg-surface-container border border-outline-variant/30 rounded-lg text-4xs px-1 text-on-surface focus:outline-none"
                                >
                                    <option value="breakfast">아침</option>
                                    <option value="lunch">점심</option>
                                    <option value="dinner">저녁</option>
                                    <option value="snack">간식</option>
                                </select>
                                <input
                                    type="text"
                                    value={mealName}
                                    onChange={(e) =>
                                        setMealName(e.target.value)
                                    }
                                    placeholder="예: 김밥"
                                    className="col-span-5 bg-surface-container border border-outline-variant/30 rounded-lg text-4xs px-2 py-1 text-on-surface focus:outline-none"
                                />
                                <input
                                    type="number"
                                    value={mealCalories}
                                    onChange={(e) =>
                                        setMealCalories(e.target.value)
                                    }
                                    placeholder="kcal"
                                    className="col-span-3 bg-surface-container border border-outline-variant/30 rounded-lg text-4xs px-1 text-on-surface focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="col-span-1 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </form>

                            {/* AI Meal Coaching Block */}
                            <div className="pt-2 border-t border-outline-variant/10 space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-on-surface flex items-center gap-1">
                                        <span>🤖</span> AI 맞춤 식단 분석 코치
                                    </span>
                                    {coachingText && (
                                        <button
                                            onClick={handleGetMealCoaching}
                                            disabled={coachingLoading}
                                            className="text-[9px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                            type="button"
                                        >
                                            {coachingLoading
                                                ? "분석 중..."
                                                : "🔄 다시 분석"}
                                        </button>
                                    )}
                                </div>

                                {coachingLoading ? (
                                    <div className="bg-surface-container/30 border border-outline-variant/10 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5">
                                        <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" />
                                        <span className="text-[9px] font-bold text-on-surface-variant">
                                            오늘 섭취 성분 및 칼로리 인공지능
                                            정밀 분석 중...
                                        </span>
                                    </div>
                                ) : coachingText ? (
                                    <div className="bg-primary/5 border border-primary/25 rounded-xl p-2.5 text-[10px] text-on-surface leading-relaxed animate-fade-in whitespace-pre-line relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-full filter blur-lg"></div>
                                        {coachingText}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleGetMealCoaching}
                                        disabled={coachingLoading}
                                        className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                                        type="button"
                                    >
                                        <span>
                                            🤖 오늘 식단 AI 분석 코칭 받기
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Rank Competition Bento */}
                    <div className="col-span-12 md:col-span-12 lg:col-span-4 bg-surface border border-outline-variant/10 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-76">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-primary" />
                                    실시간 유저 대항전
                                    <button
                                        onClick={() =>
                                            toggleHelp("userRankBento")
                                        }
                                        className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                        title="설명 보기/숨기기"
                                        type="button"
                                    >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                    </button>
                                </h3>
                                <span className="text-4xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    실시간 랭킹
                                </span>
                            </div>
                            {visibleHelp["userRankBento"] && (
                                <p className="text-4xs text-on-surface-variant bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 leading-normal animate-fade-in mt-1 mb-2">
                                    전국 탑 웰니스 유저들의 오늘 총 걸음 수
                                    실시간 대결입니다.
                                </p>
                            )}
                            <p className="text-4xs text-on-surface-variant leading-normal">
                                오늘 가장 에너제틱하게 활동 중인 탑 유저 5인의
                                실시간 기록판입니다.
                            </p>
                        </div>

                        <div className="space-y-1.5 my-2 grow overflow-y-auto scrollbar-thin">
                            {rankings.map((user, index) => {
                                const isMe = user.uid === uid;
                                return (
                                    <div
                                        key={user.uid}
                                        className={`flex items-center justify-between p-1.5 rounded-lg border text-4xs transition-all ${
                                            isMe
                                                ? "bg-primary/10 border-primary/30 font-bold"
                                                : "bg-surface-container/20 border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-4 h-4 rounded-full flex items-center justify-center text-4xs font-extrabold ${
                                                    index === 0
                                                        ? "bg-amber-500 text-white"
                                                        : index === 1
                                                          ? "bg-slate-300 text-slate-800"
                                                          : index === 2
                                                            ? "bg-amber-700 text-white"
                                                            : "bg-surface-container text-on-surface-variant"
                                                }`}
                                            >
                                                {index + 1}
                                            </span>
                                            <span className="text-on-surface">
                                                {user.nickname || "익명 사용자"}
                                                {isMe && (
                                                    <span className="text-primary text-[9px] font-black ml-1">
                                                        (나)
                                                    </span>
                                                )}
                                                <span className="text-[9px] text-on-surface-variant ml-1">
                                                    Lv.{user.level || 1}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-on-surface-variant text-[9px]">
                                                {user.school || "소속 없음"}
                                            </span>
                                            <span className="font-extrabold text-on-surface">
                                                {(
                                                    user.todaySteps || 0
                                                ).toLocaleString()}
                                                보
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {rankings.length === 0 && (
                                <div className="text-center text-4xs text-on-surface-variant py-4">
                                    랭킹 수집 중...
                                </div>
                            )}
                        </div>

                        <div className="text-center text-4xs text-on-surface-variant border-t border-outline-variant/10 pt-2 shrink-0">
                            걸음 수 기록을 자주 업데이트하여 유저 대항전에서
                            선두를 달리세요!
                        </div>
                    </div>
                </div>

                {/* Quests detailed interactive list */}
                <section className="bg-surface rounded-2xl p-5 border border-outline-variant/10 space-y-4">
                    <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                        <div>
                            <h2 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                <Award className="h-4.5 w-4.5 text-primary" />
                                오늘 달성할 핵심 퀘스트 (전용 측정기)
                                <button
                                    onClick={() =>
                                        toggleHelp("questsHeaderHelp")
                                    }
                                    className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                    title="설명 보기/숨기기"
                                    type="button"
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                            </h2>
                            {visibleHelp["questsHeaderHelp"] && (
                                <p className="text-4xs text-on-surface-variant mt-1 bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 leading-normal animate-fade-in">
                                    기기에 직접 센서가 없으므로 하위 전용
                                    팝업/제어판을 실행해 정밀하게 수행하고 완료
                                    처리할 수 있습니다.
                                </p>
                            )}
                        </div>
                        <span className="text-3xs text-on-surface-variant font-mono font-bold bg-surface-container px-2.5 py-1 rounded-full">
                            달성 개수: {completedQuests.length} / 4개
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {questItems.map((item) => {
                            const isDone = completedQuests.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                                        isDone
                                            ? "bg-primary-container/10 border-primary/20"
                                            : "bg-surface-container/30 border-outline-variant/10 hover:border-outline-variant/20"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div
                                            className={`w-8 h-8 rounded-full ${item.bgClass} flex items-center justify-center text-sm`}
                                        >
                                            {item.icon}
                                        </div>
                                        {isDone ? (
                                            <span className="text-4xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                                                달성 성공
                                            </span>
                                        ) : (
                                            <span className="text-4xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                                                진행 중
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-on-surface">
                                            {item.title}
                                        </h4>
                                        <p className="text-4xs text-on-surface-variant mt-1">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setActiveQuestWorkspace(item.id);
                                            if (item.id === "q_water") {
                                                setLocalWater(
                                                    userData.waterGlasses || 0,
                                                );
                                            }
                                        }}
                                        className="w-full py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary rounded-lg text-4xs font-bold transition-all cursor-pointer text-center"
                                    >
                                        {item.buttonLabel} &gt;&gt;
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Interactive subview for quest workspaces */}
                <AnimatePresence>
                    {activeQuestWorkspace && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border-2 border-primary/30 rounded-2xl p-6 relative overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    setActiveQuestWorkspace(null);
                                    setStretchTimerActive(false);
                                }}
                                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-all shrink-0 cursor-pointer text-on-surface-variant"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* WORKSPACE 1: STEPS */}
                            {activeQuestWorkspace === "q_steps" && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">👟</span>
                                        <div>
                                            <h3 className="text-sm font-extrabold text-on-surface">
                                                걸음 수 수동 일일 일지
                                            </h3>
                                            <p className="text-4xs text-on-surface-variant">
                                                폰 센서 연동이 없으므로, 오늘
                                                야외 활동이나 운동장 트랙에서
                                                걸은 양을 직접 적어 적립하세요!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-surface-container/20 p-4 rounded-xl">
                                        <div>
                                            <span className="text-4xs text-on-surface-variant block mb-1">
                                                오늘 총 누적 걸음수
                                            </span>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-3xl font-black text-primary font-mono">
                                                    {currentSteps.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    /{" "}
                                                    {targetSteps.toLocaleString()}{" "}
                                                    보
                                                </span>
                                            </div>
                                            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                                                <div
                                                    className="bg-primary h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${stepsProgress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={manualStepsInput}
                                                    onChange={(e) =>
                                                        setManualStepsInput(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="기록할 걸음수 입력"
                                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleAddManualSteps()
                                                    }
                                                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer"
                                                >
                                                    직접 입력
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleAddManualSteps(
                                                            "1000",
                                                        )
                                                    }
                                                    className="w-full py-1.5 bg-surface border border-outline-variant/10 hover:border-primary text-on-surface-variant hover:text-primary rounded-lg text-4xs font-bold transition-all cursor-pointer"
                                                >
                                                    +1,000보 추가
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAddManualSteps(
                                                            "3000",
                                                        )
                                                    }
                                                    className="w-full py-1.5 bg-surface border border-outline-variant/10 hover:border-primary text-on-surface-variant hover:text-primary rounded-lg text-4xs font-bold transition-all cursor-pointer"
                                                >
                                                    +3,000보 추가
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAddManualSteps(
                                                            "5000",
                                                        )
                                                    }
                                                    className="w-full py-1.5 bg-surface border border-outline-variant/10 hover:border-primary text-on-surface-variant hover:text-primary rounded-lg text-4xs font-bold transition-all cursor-pointer"
                                                >
                                                    +5,000보 추가
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WORKSPACE 2: WATER */}
                            {activeQuestWorkspace === "q_water" && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">💧</span>
                                        <div>
                                            <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                                정밀 수분 수급 로그
                                                <button
                                                    onClick={() =>
                                                        toggleHelp(
                                                            "waterLogHelp",
                                                        )
                                                    }
                                                    className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                                    title="설명 보기/숨기기"
                                                    type="button"
                                                >
                                                    <HelpCircle className="h-3.5 w-3.5" />
                                                </button>
                                            </h3>
                                            <p className="text-4xs text-on-surface-variant">
                                                일일 수분 수치 도달을 위해, 물을
                                                1컵씩 마실 때마다 버튼을 클릭해
                                                팩트를 누적하세요!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-around items-center bg-surface-container/20 p-5 rounded-xl gap-4">
                                        <div className="text-center space-y-1">
                                            <span className="text-4xs text-on-surface-variant font-bold block">
                                                오늘 섭취량
                                            </span>
                                            <div className="flex items-baseline justify-center gap-1 font-mono">
                                                <span className="text-4xl font-black text-sky-400">
                                                    {localWater}
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    /{" "}
                                                    {userData.waterTarget || 8}{" "}
                                                    잔
                                                </span>
                                            </div>
                                            <span className="text-4xs text-on-surface-variant block">
                                                (1잔 = 250ml 기준)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    handleUpdateWater(false)
                                                }
                                                className="w-12 h-12 rounded-full border border-outline-variant/10 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-all shrink-0 cursor-pointer text-on-surface bg-surface"
                                            >
                                                <Minus className="h-6 w-6 text-on-surface-variant" />
                                            </button>
                                            <div className="w-16 h-16 rounded-full bg-sky-400/10 flex items-center justify-center border-2 border-sky-400 animate-bounce">
                                                <span className="text-3xl">
                                                    🥛
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleUpdateWater(true)
                                                }
                                                className="w-12 h-12 rounded-full border border-outline-variant/10 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-all shrink-0 cursor-pointer text-on-surface bg-surface animate-pulse"
                                            >
                                                <Plus className="h-6 w-6 text-primary" />
                                            </button>
                                        </div>

                                        <div className="text-4xs text-on-surface-variant leading-relaxed text-center md:text-left max-w-xs">
                                            💡 물은 하루 동안 일정 간격을 지켜
                                            마시는 것이 효과적입니다. 공부하는
                                            책상 옆에 물컵을 거치해 두는 습관을
                                            유도해 보세요.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WORKSPACE 3: STRETCHING TIMER */}
                            {activeQuestWorkspace === "q_stretch" && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🧘</span>
                                        <div>
                                            <h3 className="text-sm font-extrabold text-on-surface">
                                                목/어깨 10분 바른 스트레칭
                                                스톱워치
                                            </h3>
                                            <p className="text-4xs text-on-surface-variant">
                                                10분의 전용 타이머를 켜고 직접
                                                움직이세요. 완료되면 자동으로
                                                퀘스트가 완료 처리됩니다!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-around items-center bg-surface-container/20 p-5 rounded-xl gap-4">
                                        <div className="text-center space-y-1">
                                            <span className="text-4xs text-on-surface-variant font-bold block">
                                                남은 타이머
                                            </span>
                                            <span className="text-4xl font-black text-violet-400 font-mono tracking-widest block">
                                                {formatTime(stretchSecondsLeft)}
                                            </span>
                                            <span className="text-4xs text-on-surface-variant block">
                                                (목표 스트레칭 요구 시간: 10분)
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() =>
                                                    setStretchTimerActive(
                                                        !stretchTimerActive,
                                                    )
                                                }
                                                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                    stretchTimerActive
                                                        ? "bg-amber-500 text-white"
                                                        : "bg-primary text-on-primary"
                                                }`}
                                            >
                                                <Timer className="h-4 w-4" />
                                                <span>
                                                    {stretchTimerActive
                                                        ? "스트레칭 일시정지"
                                                        : "자세이완 스트레칭 시작"}
                                                </span>
                                            </button>

                                            <button
                                                onClick={
                                                    handleCompleteStretchQuest
                                                }
                                                className="px-6 py-2.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span>가속 / 즉시 완료</span>
                                            </button>
                                        </div>

                                        <div className="text-4xs text-on-surface-variant leading-relaxed max-w-xs text-center md:text-left">
                                            🧘 **간편 목 스트레칭 방법**: <br />
                                            어깨를 펴고 머리를 서서히 왼쪽,
                                            오른쪽으로 10초간 기울입니다. 그 뒤
                                            천천히 큰 원을 그리듯 회전하세요.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dynamic Recharts charts representing multi dimensional fitness stats */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* CHART 1: WEEKLY WATER TRENDS */}
                    <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-80">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    일주일 수분 섭취 추이
                                    <button
                                        onClick={() => toggleHelp("waterChart")}
                                        className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                        title="설명 보기/숨기기"
                                        type="button"
                                    >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                    </button>
                                </h3>
                            </div>
                            {visibleHelp["waterChart"] && (
                                <p className="text-4xs text-on-surface-variant mt-1 bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 leading-normal animate-fade-in">
                                    매일 수분 목표 도달량을 분석하여 건강한 하루
                                    수분 섭취 습관을 기록합니다.
                                </p>
                            )}
                        </div>

                        {/* Recharts Area Graph */}
                        <div className="grow w-full flex items-center justify-center my-2">
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart
                                    data={[
                                        { day: "월", glasses: 4 },
                                        { day: "화", glasses: 6 },
                                        { day: "수", glasses: 8 },
                                        { day: "목", glasses: localWater },
                                        { day: "금", glasses: 5 },
                                        { day: "토", glasses: 7 },
                                        { day: "일", glasses: 6 },
                                    ]}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorWater"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="var(--color-outline-variant)"
                                        opacity={0.15}
                                    />
                                    <XAxis
                                        dataKey="day"
                                        tick={{
                                            fill: "var(--color-on-surface-variant)",
                                            fontSize: 10,
                                            fontWeight: "bold",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 12]}
                                        tick={{
                                            fill: "var(--color-on-surface-variant)",
                                            fontSize: 10,
                                            fontWeight: "bold",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickCount={4}
                                        unit="잔"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "var(--color-surface)",
                                            borderColor:
                                                "var(--color-outline-variant)",
                                            borderRadius: "12px",
                                            color: "var(--color-on-surface)",
                                            fontSize: "11px",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="glasses"
                                        stroke="var(--color-primary)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorWater)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CHART 2: STUDY VS PHYSICAL BALANCER SCALE */}
                    <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-80">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    공부 시간 vs 신체 웰니스 균형 추
                                    <button
                                        onClick={() =>
                                            toggleHelp("balanceChart")
                                        }
                                        className="text-on-surface-variant hover:text-primary transition-all p-0.5 rounded hover:bg-surface-container cursor-pointer ml-1"
                                        title="설명 보기/숨기기"
                                        type="button"
                                    >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                    </button>
                                </h3>
                            </div>
                            {visibleHelp["balanceChart"] && (
                                <p className="text-4xs text-on-surface-variant mt-1 bg-surface-container/50 p-2 rounded-lg border border-outline-variant/10 leading-normal animate-fade-in">
                                    공부 착석 시간과 걷기/운동 등의 실제 활동을
                                    비교해 일과 밸런스를 피드백합니다.
                                </p>
                            )}
                        </div>

                        {/* Recharts Bar Graph */}
                        <div className="grow flex flex-col justify-center my-2">
                            <div className="text-center mb-1">
                                <span className="text-4xs text-on-surface-variant font-bold block">
                                    현재 밸런스 상태
                                </span>
                                <span className="text-xs font-black text-primary">
                                    {userData && (userData.studyHours || 4) > 8
                                        ? "공부 집중 과다 (스트레칭 절실!)"
                                        : "안정적인 하이브리드 생활"}
                                </span>
                            </div>

                            <div className="h-28 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            {
                                                name: "학업 공부 (시간)",
                                                value: userData
                                                    ? userData.studyHours || 4
                                                    : 4,
                                                color: "var(--color-primary)",
                                            },
                                            {
                                                name: "신체 활동량 (지표)",
                                                value: userData
                                                    ? Math.round(
                                                          ((userData.todaySteps ||
                                                              0) /
                                                              1000) *
                                                              1.5 +
                                                              (
                                                                  userData.completedQuests ||
                                                                  []
                                                              ).length *
                                                                  2,
                                                      )
                                                    : 0,
                                                color: "var(--color-accent, #10b981)",
                                            },
                                        ]}
                                        layout="vertical"
                                        margin={{
                                            top: 10,
                                            right: 15,
                                            left: -5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            stroke="var(--color-outline-variant)"
                                            opacity={0.1}
                                        />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{
                                                fill: "var(--color-on-surface-variant)",
                                                fontSize: 10,
                                                fontWeight: "extrabold",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={100}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    "var(--color-surface)",
                                                borderColor:
                                                    "var(--color-outline-variant)",
                                                borderRadius: "12px",
                                                color: "var(--color-on-surface)",
                                                fontSize: "11px",
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[0, 8, 8, 0]}
                                            barSize={16}
                                        >
                                            {[
                                                {
                                                    color: "var(--color-primary)",
                                                },
                                                {
                                                    color: "var(--color-accent, #10b981)",
                                                },
                                            ].map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {visibleHelp["balanceChart"] && (
                            <div className="text-center text-[10px] text-on-surface-variant border-t border-outline-variant/10 pt-2 shrink-0 animate-fade-in">
                                💡 오랫동안 앉아서 학습 시에는 1시간 주기로 🧘
                                스트레칭 10분을 이행하여 척추 피로도를 즉각
                                해소해야 합니다.
                            </div>
                        )}
                    </div>
                </section>

                {/* Achievements badge gallery */}
                <section className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-xs">
                    <h3 className="text-sm font-extrabold text-on-surface mb-3 flex items-center gap-2">
                        🏆 건강 훈장 배지 쇼케이스
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {AVAILABLE_BADGES.map((badge) => {
                            const hasBadge = userBadges.includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`border rounded-xl p-4 flex gap-3 items-center transition-all ${
                                        hasBadge
                                            ? badge.color
                                            : "bg-surface-container/25 border-outline-variant/10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
                                    }`}
                                >
                                    <div className="text-3xl select-none filter drop-shadow-sm">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-on-surface">
                                            {badge.title}
                                        </h4>
                                        <p className="text-4xs text-on-surface-variant mt-0.5 leading-snug">
                                            {badge.desc}
                                        </p>
                                        <span className="text-4xs font-bold text-primary block mt-1 font-mono">
                                            {hasBadge
                                                ? "✓ 보유 완료"
                                                : "잠금 해제 필요"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
