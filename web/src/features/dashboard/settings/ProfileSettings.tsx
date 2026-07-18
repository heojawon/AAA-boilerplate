import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GetDocument from "../../../utils/db/CRUD/GetDocument";
import UpdateDocument from "../../../utils/db/CRUD/UpdateDocument";
import type { UserDocument } from "../../auth/types";
import { useNavigate } from "react-router";
import {
    Save,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    User,
    Activity,
    Sparkles,
    Scale,
    GraduationCap,
    Heart,
    Smile,
    Flame,
    Zap,
    Trophy,
    Award,
    HelpCircle,
} from "lucide-react";

export const ICON_AVATARS = [
    { name: "기본 인물", value: "User" },
    { name: "미소", value: "Smile" },
    { name: "불꽃", value: "Flame" },
    { name: "번개", value: "Zap" },
    { name: "하트", value: "Heart" },
    { name: "스파클", value: "Sparkles" },
    { name: "트로피", value: "Trophy" },
    { name: "메달", value: "Award" },
];

export function renderAvatar(src: string, className = "h-8 w-8 text-primary") {
    if (!src || (!src.startsWith("http://") && !src.startsWith("https://"))) {
        const iconName = src || "User";
        switch (iconName) {
            case "Smile":
                return <Smile className={className} />;
            case "Flame":
                return <Flame className={className} />;
            case "Zap":
                return <Zap className={className} />;
            case "Heart":
                return <Heart className={className} />;
            case "Sparkles":
                return <Sparkles className={className} />;
            case "Trophy":
                return <Trophy className={className} />;
            case "Award":
                return <Award className={className} />;
            case "User":
            default:
                return <User className={className} />;
        }
    }
    return (
        <img
            src={src}
            alt="Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
        />
    );
}

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDesc, setShowDesc] = useState(false);

    // DTS Form States
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [school, setSchool] = useState("");
    const [grade, setGrade] = useState("중3");
    const [birthYear, setBirthYear] = useState(2010);
    const [gender, setGender] = useState<"male" | "female" | "none">("none");
    const [height, setHeight] = useState(165);
    const [weight, setWeight] = useState(55);
    const [exerciseLevel, setExerciseLevel] = useState<
        "low" | "medium" | "high"
    >("medium");
    const [studyHours, setStudyHours] = useState(4);
    const [targetSteps, setTargetSteps] = useState(8000);
    const [targetExerciseMinutes, setTargetExerciseMinutes] = useState(40);
    const [interests, setInterests] = useState<string[]>([]);
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [healthGoal, setHealthGoal] = useState("기초 체력을 기르고 싶어요");
    const [profileImage, setProfileImage] = useState("");

    // Extra states for backward compatibility/enrichment
    const [sleepTarget, setSleepTarget] = useState(8);
    const [waterTarget, setWaterTarget] = useState(8);
    const [dietPreference, setDietPreference] = useState<
        "balanced" | "low-carb" | "high-protein" | "vegan" | "keto"
    >("balanced");

    // Interest list presets
    const interestOptions = [
        "피트니스",
        "수분 섭취",
        "바른 자세",
        "체중 조절",
        "식단 관리",
        "스트레칭",
        "수면 습관",
        "학업 집중력",
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                try {
                    const docSnap = await GetDocument("users", user.uid);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserDocument;
                        setNickname(data.nickname || "체험 사용자");
                        setEmail(
                            data.email || user.email || "test@example.com",
                        );
                        setSchool(data.school || "");
                        setGrade(data.grade || "중3");
                        setBirthYear(data.birthYear || 2010);
                        setGender(data.gender || "none");
                        setHeight(data.height || 165);
                        setWeight(data.weight || 55);
                        setExerciseLevel(data.exerciseLevel || "medium");
                        setStudyHours(data.studyHours || 4);
                        setTargetSteps(data.targetSteps || 8000);
                        setTargetExerciseMinutes(
                            data.targetExerciseMinutes || 40,
                        );
                        setInterests(
                            data.interests || ["피트니스", "스트레칭"],
                        );
                        setNotificationEnabled(
                            data.notificationEnabled !== false,
                        );
                        setHealthGoal(
                            data.healthGoal || "기초 체력을 기르고 싶어요",
                        );
                        setProfileImage(data.profileImage || "User");

                        setSleepTarget(data.sleepTarget || 8);
                        setWaterTarget(data.waterTarget || 8);
                        setDietPreference(data.dietPreference || "balanced");
                    }
                } catch (err) {
                    console.error("Failed to load user data:", err);
                    setError("데이터를 불러오는 데 실패했습니다.");
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/auth");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleInterestToggle = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter((i) => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uid) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await UpdateDocument("users", uid, {
                nickname,
                email,
                school,
                grade,
                birthYear,
                gender,
                height,
                weight,
                exerciseLevel,
                studyHours,
                targetSteps,
                targetExerciseMinutes,
                interests,
                notificationEnabled,
                healthGoal,
                profileImage,
                sleepTarget,
                waterTarget,
                dietPreference,
                updatedAt: new Date().toISOString(),
            });
            setSuccess("프로필 설정이 성공적으로 저장되었습니다.");

            // Temporary alert/success notification simulation
            const event = new CustomEvent("toast-message", {
                detail: {
                    text: "프로필 및 상세 건강 목표 설정이 반영되었습니다.",
                    type: "success",
                },
            });
            window.dispatchEvent(event);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
            setError("설정을 저장하는 데 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setSaving(false);
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
                    <User className="h-5 w-5 text-primary" />
                    프로필 및 상세 건강 설정
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
                        신체 치수, 학업 시간, 학교 정보 및 일일 맞춤형 목표를
                        정밀하게 설정하세요.
                    </p>
                )}
            </div>

            {error && (
                <div className="bg-error-container/20 border border-error/20 p-4 rounded-xl flex items-start gap-3 text-red-500 animate-fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3 text-emerald-500 animate-fade-in">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar Selection and URL upload */}
                <div className="bg-surface p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                    <label className="block text-sm font-bold text-on-surface flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        프로필 캐릭터 아이콘 선택 및 직접 URL 업로드
                    </label>
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden shadow-md shrink-0 bg-surface-container flex items-center justify-center">
                            {renderAvatar(profileImage, "h-8 w-8 text-primary")}
                        </div>
                        <div className="grow space-y-3 w-full">
                            <div className="flex flex-wrap gap-2">
                                {ICON_AVATARS.map((avatar) => (
                                    <button
                                        key={avatar.value}
                                        type="button"
                                        onClick={() =>
                                            setProfileImage(avatar.value)
                                        }
                                        className={`relative rounded-xl overflow-hidden w-11 h-11 border-2 transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${profileImage === avatar.value ? "border-primary bg-primary/10 ring-2 ring-primary-container" : "border-outline-variant/20 bg-surface-container hover:bg-surface-container-high"}`}
                                        title={avatar.name}
                                    >
                                        {renderAvatar(
                                            avatar.value,
                                            "h-5 w-5 text-primary",
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-1">
                                <label className="block text-4xs font-bold text-on-surface-variant">
                                    사용자 직접 사진 URL 주소 입력
                                </label>
                                <input
                                    type="text"
                                    value={
                                        profileImage.startsWith("http")
                                            ? profileImage
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setProfileImage(
                                            e.target.value || "User",
                                        )
                                    }
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                    placeholder="https://example.com/my-profile.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic info, School info */}
                    <div className="bg-surface p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                        <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-outline-variant/10 pb-2">
                            <GraduationCap className="h-4 w-4" /> 학생 및 기본
                            신원 정보
                        </h3>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-on-surface-variant">
                                닉네임
                            </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                placeholder="닉네임 입력"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-on-surface-variant">
                                이메일 주소
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                placeholder="email@domain.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    소속 학교
                                </label>
                                <input
                                    type="text"
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                    placeholder="예: 서울중학교"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    학년
                                </label>
                                <select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2.5 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                                >
                                    <option value="중1">중학교 1학년</option>
                                    <option value="중2">중학교 2학년</option>
                                    <option value="중3">중학교 3학년</option>
                                    <option value="고1">고등학교 1학년</option>
                                    <option value="고2">고등학교 2학년</option>
                                    <option value="고3">고등학교 3학년</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    출생 연도
                                </label>
                                <input
                                    type="number"
                                    value={birthYear}
                                    onChange={(e) =>
                                        setBirthYear(Number(e.target.value))
                                    }
                                    min="1990"
                                    max="2026"
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    성별
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) =>
                                        setGender(e.target.value as any)
                                    }
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2.5 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                                >
                                    <option value="none">선택 안함</option>
                                    <option value="male">남성</option>
                                    <option value="female">여성</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Physical Metrics & Health Goals */}
                    <div className="bg-surface p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                        <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-outline-variant/10 pb-2">
                            <Scale className="h-4 w-4" /> 신체 치수 및 활동 습관
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    키 (cm)
                                </label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) =>
                                        setHeight(Number(e.target.value))
                                    }
                                    min="100"
                                    max="250"
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant">
                                    몸무게 (kg)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) =>
                                        setWeight(Number(e.target.value))
                                    }
                                    min="20"
                                    max="200"
                                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-on-surface-variant">
                                평소 신체 활동량
                            </label>
                            <select
                                value={exerciseLevel}
                                onChange={(e) =>
                                    setExerciseLevel(e.target.value as any)
                                }
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2.5 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                            >
                                <option value="low">거의 안 함 (Low)</option>
                                <option value="medium">
                                    주 1~4회 가벼운 활동 (Medium)
                                </option>
                                <option value="high">
                                    거의 매일 고강도 운동 (High)
                                </option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-on-surface-variant">
                                일일 책상 착석/공부 시간
                            </label>
                            <select
                                value={studyHours}
                                onChange={(e) =>
                                    setStudyHours(Number(e.target.value))
                                }
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2.5 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                            >
                                <option value={2}>2시간 이하</option>
                                <option value={4}>3 ~ 5시간</option>
                                <option value={7}>6 ~ 8시간</option>
                                <option value={10}>9시간 이상</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-on-surface-variant">
                                주요 건강 해결 목표
                            </label>
                            <select
                                value={healthGoal}
                                onChange={(e) => setHealthGoal(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2.5 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                            >
                                <option value="기초 체력을 기르고 싶어요">
                                    기초 체력을 기르고 싶어요
                                </option>
                                <option value="운동 습관을 만들고 싶어요">
                                    운동 습관을 만들고 싶어요
                                </option>
                                <option value="오래 앉아 있는 습관을 개선하고 싶어요">
                                    오래 앉아 있는 습관을 개선하고 싶어요
                                </option>
                                <option value="규칙적인 생활을 하고 싶어요">
                                    규칙적인 생활을 하고 싶어요
                                </option>
                                <option value="활력을 높이고 싶어요">
                                    활력을 높이고 싶어요
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Target Metrics */}
                <div className="bg-surface p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-outline-variant/10 pb-2">
                        <Activity className="h-4 w-4" /> 일일 건강 수치 목표
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="block text-3xs font-bold text-on-surface-variant">
                                목표 걸음 수
                            </label>
                            <input
                                type="number"
                                value={targetSteps}
                                onChange={(e) =>
                                    setTargetSteps(Number(e.target.value))
                                }
                                min="2000"
                                max="30000"
                                step="500"
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-3xs font-bold text-on-surface-variant">
                                목표 운동 시간 (분)
                            </label>
                            <input
                                type="number"
                                value={targetExerciseMinutes}
                                onChange={(e) =>
                                    setTargetExerciseMinutes(
                                        Number(e.target.value),
                                    )
                                }
                                min="10"
                                max="300"
                                step="5"
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-3xs font-bold text-on-surface-variant">
                                물 섭취 목표 (잔)
                            </label>
                            <input
                                type="number"
                                value={waterTarget}
                                onChange={(e) =>
                                    setWaterTarget(Number(e.target.value))
                                }
                                min="2"
                                max="20"
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-3xs font-bold text-on-surface-variant">
                                수면 목표 시간
                            </label>
                            <input
                                type="number"
                                value={sleepTarget}
                                onChange={(e) =>
                                    setSleepTarget(Number(e.target.value))
                                }
                                min="4"
                                max="14"
                                step="0.5"
                                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Interests */}
                <div className="bg-surface p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-outline-variant/10 pb-2">
                        <Heart className="h-4 w-4" /> 나의 건강 관심사 설정
                    </h3>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-on-surface-variant">
                            관심 분야 태그 선택 (복수 선택)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {interestOptions.map((opt) => {
                                const active = interests.includes(opt);
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() =>
                                            handleInterestToggle(opt)
                                        }
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${active ? "bg-primary text-on-primary" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/10"}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Form Action */}
                <div className="flex justify-end pt-2 border-t border-outline-variant/20">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer text-sm"
                    >
                        {saving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>설정값 저장하기</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
