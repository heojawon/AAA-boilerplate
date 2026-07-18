import React, { useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { type UserDocument } from "../types";
import StepProgressBar from "./StepProgressBar";
import { buildSignupMetadata } from "../../../lib/utils";
import { logger } from "../../../utils/logger/logger";
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Check,
    Mail,
    User,
    Activity,
    Heart,
    Footprints,
    Brain,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

interface SignUpWizardProps {
    onCancel: () => void;
    onSuccess: () => void;
    googleUser?: { email: string; uid: string } | null;
}

export default function SignUpWizard({
    onCancel,
    onSuccess,
    googleUser = null,
}: SignUpWizardProps) {
    const [step, setStep] = useState(googleUser ? 2 : 1);
    const [, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Account
    const [email, setEmail] = useState(googleUser?.email || "");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // Step 2: Basic Profile
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState<"male" | "female" | "none">("none");
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Step 3: Health Info
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [exerciseLevel, setExerciseLevel] = useState<
        "low" | "medium" | "high"
    >("medium");
    const [studyHours, setStudyHours] = useState<number>(4); // Default 3-5 hrs category

    // Step 4: Goals
    const [targetSteps, setTargetSteps] = useState<number>(8000);
    const [targetStepsCustom, setTargetStepsCustom] = useState<string>("");
    const [targetExerciseMinutes, setTargetExerciseMinutes] =
        useState<number>(30);
    const [isCustomSteps, setIsCustomSteps] = useState(false);

    // Step 5: Interests
    const [interests, setInterests] = useState<string[]>([]);

    // Step 6: Notifications
    const [notifQuests] = useState(true);
    const [notifExercise] = useState(true);
    const [notifStretch] = useState(true);
    const [notifWater] = useState(true);

    // Step 7: Personal Health Goals (AI suggestions addition)
    const [healthGoal, setHealthGoal] = useState("운동 습관을 만들고 싶어요");

    // Options lists
    const INTEREST_OPTIONS = [
        { id: "walking", label: "🚶 걷기" },
        { id: "running", label: "🏃 달리기" },
        { id: "stretching", label: "🧘 스트레칭" },
        { id: "hometraining", label: "🏠 홈트레이닝" },
        { id: "cycling", label: "🚴 자전거" },
        { id: "soccer", label: "⚽ 축구" },
        { id: "basketball", label: "🏀 농구" },
        { id: "fitness", label: "💪 헬스" },
        { id: "yoga", label: "🧘‍♀️ 요가" },
    ];

    const HEALTH_GOAL_OPTIONS = [
        {
            label: "🏃 기초 체력을 기르고 싶어요",
            value: "기초 체력을 기르고 싶어요",
        },
        {
            label: "💪 운동 습관을 만들고 싶어요",
            value: "운동 습관을 만들고 싶어요",
        },
        {
            label: "🪑 오래 앉아 있는 습관을 개선하고 싶어요",
            value: "오래 앉아 있는 습관을 개선하고 싶어요",
        },
        {
            label: "😴 규칙적인 생활을 하고 싶어요",
            value: "규칙적인 생활을 하고 싶어요",
        },
        { label: "⚡ 활력을 높이고 싶어요", value: "활력을 높이고 싶어요" },
    ];

    const handleInterestToggle = (interestLabel: string) => {
        if (interests.includes(interestLabel)) {
            setInterests(interests.filter((i) => i !== interestLabel));
        } else {
            if (interests.length < 5) {
                setInterests([...interests, interestLabel]);
            } else {
                setError("관심 분야는 최대 5개까지 선택 가능합니다.");
            }
        }
    };

    const validateStep = () => {
        setError("");
        if (step === 1) {
            if (!email || !password || !passwordConfirm) {
                setError("모든 필드를 입력해 주세요.");
                return false;
            }
            if (password.length < 6) {
                setError("비밀번호는 최소 6자 이상이어야 합니다.");
                return false;
            }
            if (password !== passwordConfirm) {
                setError("비밀번호가 서로 일치하지 않습니다.");
                return false;
            }
            if (!termsAccepted) {
                setError("이용약관에 동의해 주세요.");
                return false;
            }
        } else if (step === 2) {
            if (!nickname.trim()) {
                setError("닉네임을 입력해 주세요.");
                return false;
            }
        } else if (step === 3) {
            if (!height || height <= 0) {
                setError("올바른 키(cm)를 입력해 주세요.");
                return false;
            }
            if (!weight || weight <= 0) {
                setError("올바른 몸무게(kg)를 입력해 주세요.");
                return false;
            }
        } else if (step === 5) {
            if (interests.length === 0) {
                setError("최소 1개 이상의 관심 분야를 선택해 주세요.");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setError("");
        setStep(step - 1);
    };

    const handleBack = () => {
        if (googleUser && step === 2) {
            onCancel();
            return;
        }

        if (step === 1) {
            onCancel();
            return;
        }

        prevStep();
    };

    const handleFinish = async () => {
        if (!validateStep()) return;

        setLoading(true);
        setError("");

        // Start artificial AI loading screen for 2.5 seconds first to make it look incredibly smart and premium
        setStep(7);

        try {
            // 1. Get or Create User Auth
            let uid = "";
            if (googleUser) {
                uid = googleUser.uid;
            } else {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );
                uid = userCredential.user.uid;
            }

            const signupMetadata = buildSignupMetadata();
            logger(
                "AuthSignup",
                "info",
                "회원가입 메타데이터 수집",
                JSON.stringify({
                    signupMethod: googleUser ? "google" : "email",
                    emailDomain: email.split("@")[1] || "unknown",
                    ...signupMetadata,
                }),
            );

            // 2. Calculate dynamic Health Score based on input metrics
            // BMI calculation
            const hM = Number(height) / 100;
            const calculatedBmi = Number(weight) / (hM * hM);
            let bmiPoints = 20;
            if (calculatedBmi >= 18.5 && calculatedBmi <= 23) {
                bmiPoints = 40; // Perfect score for standard healthy BMI
            } else if (calculatedBmi >= 23 && calculatedBmi < 25) {
                bmiPoints = 30;
            } else if (calculatedBmi < 18.5) {
                bmiPoints = 25;
            }

            // Exercise level points
            let exercisePoints = 10;
            if (exerciseLevel === "medium") exercisePoints = 30;
            if (exerciseLevel === "high") exercisePoints = 40;

            // Study duration healthy posture adjustments
            let studyPoints = 20;
            if (studyHours >= 8) studyPoints = 5;
            else if (studyHours >= 6) studyPoints = 10;
            else if (studyHours >= 3) studyPoints = 15;

            const healthScore = Math.min(
                100,
                bmiPoints + exercisePoints + studyPoints,
            );

            // 3. Prepare User Document
            const finalSteps =
                isCustomSteps && targetStepsCustom
                    ? Number(targetStepsCustom)
                    : targetSteps;
            const userDocument: UserDocument = {
                uid,
                nickname,
                email,
                gender,
                height: Number(height),
                weight: Number(weight),
                exerciseLevel,
                studyHours,
                targetSteps: finalSteps,
                targetExerciseMinutes,
                interests,
                notificationEnabled:
                    notifQuests || notifExercise || notifStretch || notifWater,
                healthGoal,
                accountMeta: {
                    signupMethod: googleUser ? "google" : "email",
                    emailDomain: email.split("@")[1] || "unknown",
                    ...signupMetadata,
                },

                // Auto-generated MVP fields
                healthScore,
                level: 1,
                experience: 0,
                streak: 1, // Start with streak 1 on registration
                todaySteps: 0,
                todayExerciseMinutes: 0,
                completedQuests: [],
                badges: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // 4. Save to Firestore
            const userDocRef = doc(db, "users", uid);
            logger(
                "AuthSignup",
                "info",
                "회원가입 문서 저장 시도",
                JSON.stringify(userDocument.accountMeta),
            );
            await setDoc(userDocRef, userDocument);
            logger(
                "AuthSignup",
                "info",
                "회원가입 문서 저장 완료",
                JSON.stringify(userDocument.accountMeta),
            );

            // Delay a little bit to showcase the AI screen
            setTimeout(() => {
                setLoading(false);
                onSuccess();
            }, 2500);
        } catch (err: unknown) {
            console.error("Sign up failure:", err);
            logger(
                "AuthSignup",
                "error",
                "회원가입 처리 실패",
                err instanceof Error ? err.message : "unknown-error",
            );
            // Revert from AI screen to the final form step if error occurs
            setStep(6);
            setLoading(false);
            if (
                (err as { code?: string }).code === "auth/email-already-in-use"
            ) {
                setError("이미 사용 중인 이메일 주소입니다.");
            } else if (
                (err as { code?: string }).code === "auth/invalid-email"
            ) {
                setError("유효하지 않은 이메일 형식입니다.");
            } else if (
                (err as { code?: string }).code === "auth/weak-password"
            ) {
                setError("비밀번호가 너무 취약합니다.");
            } else {
                setError(
                    "가입 진행 중 예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.",
                );
            }
        }
    };

    const handleStepClick = (targetStep: number) => {
        if (googleUser && targetStep === 1) {
            return;
        }

        if (targetStep < step) {
            setError("");
            setStep(targetStep);
        }
    };

    return (
        <div
            className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6"
            id="signup-wizard-root"
        >
            {/* Header Panel */}
            {step < 8 && (
                <div className="w-full max-w-md mb-6" id="signup-header">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-all"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <span className="font-display-lg text-lg text-primary font-bold">
                            MoveUp 회원가입
                        </span>
                        <div className="w-9"></div>{" "}
                        {/* Empty space for centering */}
                    </div>

                    {/* Stepper bar component */}
                    <StepProgressBar
                        currentStep={step}
                        totalSteps={6}
                        onStepClick={handleStepClick}
                    />
                </div>
            )}

            {/* Main Card */}
            <div
                className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-lg p-6 relative overflow-hidden"
                id="signup-card"
            >
                {error && step < 8 && (
                    <div
                        className="bg-error-container/20 border border-error/20 p-3.5 rounded-xl flex items-start gap-2.5 text-error text-xs font-body-md mb-4"
                        id="signup-error-box"
                    >
                        <span className="leading-normal">{error}</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* STEP 1: Email & Password */}
                    {step === 1 && (
                        <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span>1단계. 계정 정보 입력</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    로그인과 본인 인증에 필요한 계정을
                                    설정하세요.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        이메일 주소
                                    </label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="example@email.com"
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        비밀번호
                                    </label>
                                    <input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="최소 6자 이상 입력하세요"
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        비밀번호 확인
                                    </label>
                                    <input
                                        id="signup-password-confirm"
                                        type="password"
                                        required
                                        value={passwordConfirm}
                                        onChange={(e) =>
                                            setPasswordConfirm(e.target.value)
                                        }
                                        placeholder="비밀번호를 한번 더 입력하세요"
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                </div>

                                <div className="rounded-xl border border-outline-variant/70 bg-surface-container-low p-3">
                                    <label className="flex items-start gap-2 text-xs font-body-md text-on-surface-variant">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) =>
                                                setTermsAccepted(
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                        />
                                        <span>
                                            이용약관 및 개인정보 처리방침에
                                            동의합니다.
                                            <Link
                                                to="/terms"
                                                className="ml-1 text-primary underline underline-offset-2"
                                            >
                                                약관 보기
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: Basic Profile */}
                    {step === 2 && (
                        <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <span>2단계. 기본 프로필</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    랭킹 산정과 친구 매칭에 사용되는 정보를
                                    알려주세요.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Nickname */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        닉네임
                                    </label>
                                    <input
                                        id="signup-nickname"
                                        type="text"
                                        required
                                        maxLength={10}
                                        value={nickname}
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                        placeholder="예: 런닝보이"
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                </div>

                                {/* Gender (Optional) */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        성별 (선택)
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(
                                            ["male", "female", "none"] as const
                                        ).map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setGender(g)}
                                                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                                    gender === g
                                                        ? "bg-primary text-on-primary border-primary shadow-sm shadow-primary/10"
                                                        : "bg-surface border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                {g === "male"
                                                    ? "남성"
                                                    : g === "female"
                                                      ? "여성"
                                                      : "선택 안 함"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: Health info */}
                    {step === 3 && (
                        <motion.div
                            key="step-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <span>3단계. 신체 정보 및 학습 환경</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    기초대사량, 권장 활동 지수 계산에
                                    활용됩니다.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Height / Weight */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-label-md text-on-surface">
                                            키 (cm)
                                        </label>
                                        <input
                                            id="signup-height"
                                            type="number"
                                            required
                                            value={height}
                                            onChange={(e) =>
                                                setHeight(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(
                                                              e.target.value,
                                                          ),
                                                )
                                            }
                                            placeholder="예: 170"
                                            className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-label-md text-on-surface">
                                            몸무게 (kg)
                                        </label>
                                        <input
                                            id="signup-weight"
                                            type="number"
                                            required
                                            value={weight}
                                            onChange={(e) =>
                                                setWeight(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(
                                                              e.target.value,
                                                          ),
                                                )
                                            }
                                            placeholder="예: 60"
                                            className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Exercise Frequency */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        평소 운동 빈도
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                id: "low",
                                                label: "🛌 거의 안 함",
                                                desc: "가벼운 걷기 외에는 거의 운동하지 않음",
                                            },
                                            {
                                                id: "medium",
                                                label: "🏃 주 1~3회",
                                                desc: "주 1~3회 정기적으로 가벼운 실외 운동/스포츠",
                                            },
                                            {
                                                id: "high",
                                                label: "🔥 거의 매일",
                                                desc: "주 4회 이상 고강도 피트니스, 러닝, 구기종목",
                                            },
                                        ].map((freq) => (
                                            <button
                                                key={freq.id}
                                                type="button"
                                                onClick={() =>
                                                    setExerciseLevel(
                                                        freq.id as
                                                            | "low"
                                                            | "medium"
                                                            | "high",
                                                    )
                                                }
                                                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                                    exerciseLevel === freq.id
                                                        ? "bg-primary/5 border-primary ring-1 ring-primary"
                                                        : "bg-surface border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                <div className="mt-0.5">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            exerciseLevel ===
                                                            freq.id
                                                        }
                                                        readOnly
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">
                                                        {freq.label}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant font-body-md mt-0.5">
                                                        {freq.desc}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Study Hours */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        하루 평균 공부 시간
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 2, label: "2시간 이하" },
                                            { value: 4, label: "3~5시간" },
                                            { value: 7, label: "6~8시간" },
                                            { value: 10, label: "9시간 이상" },
                                        ].map((hour) => (
                                            <button
                                                key={hour.value}
                                                type="button"
                                                onClick={() =>
                                                    setStudyHours(hour.value)
                                                }
                                                className={`py-3.5 rounded-xl text-xs font-semibold border transition-all ${
                                                    studyHours === hour.value
                                                        ? "bg-primary text-on-primary border-primary shadow-sm shadow-primary/10"
                                                        : "bg-surface border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                {hour.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: Goals settings */}
                    {step === 4 && (
                        <motion.div
                            key="step-4"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <Footprints className="h-5 w-5 text-primary" />
                                    <span>4단계. 하루 목표 설정</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    내가 감당할 수 있는 적정 수준의 활동 미션
                                    목표를 세우세요.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Steps goal */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        하루 목표 걸음 수
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[6000, 8000, 10000].map((stepsOpt) => (
                                            <button
                                                key={stepsOpt}
                                                type="button"
                                                onClick={() => {
                                                    setTargetSteps(stepsOpt);
                                                    setIsCustomSteps(false);
                                                }}
                                                className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                                    targetSteps === stepsOpt &&
                                                    !isCustomSteps
                                                        ? "bg-primary text-on-primary border-primary shadow-sm"
                                                        : "bg-surface border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                {stepsOpt.toLocaleString()}보
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsCustomSteps(true)}
                                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                            isCustomSteps
                                                ? "bg-primary/5 border-primary font-bold text-primary"
                                                : "bg-surface border-outline-variant hover:bg-surface-container text-on-surface-variant"
                                        }`}
                                    >
                                        직접 입력하기
                                    </button>

                                    {isCustomSteps && (
                                        <input
                                            id="custom-steps-input"
                                            type="number"
                                            value={targetStepsCustom}
                                            onChange={(e) =>
                                                setTargetStepsCustom(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="예: 7500 (최소 1,000)"
                                            className="w-full bg-surface border border-primary rounded-xl p-3 text-sm font-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    )}
                                </div>

                                {/* Exercise duration goal */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-label-md text-on-surface">
                                        하루 목표 운동 시간
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[20, 30, 45, 60].map((minsOpt) => (
                                            <button
                                                key={minsOpt}
                                                type="button"
                                                onClick={() =>
                                                    setTargetExerciseMinutes(
                                                        minsOpt,
                                                    )
                                                }
                                                className={`py-3.5 rounded-xl text-xs font-bold border transition-all ${
                                                    targetExerciseMinutes ===
                                                    minsOpt
                                                        ? "bg-primary text-on-primary border-primary shadow-sm"
                                                        : "bg-surface border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                {minsOpt}분
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: Interests */}
                    {step === 5 && (
                        <motion.div
                            key="step-5"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-primary" />
                                    <span>5단계. 나의 관심 운동 분야</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    내가 관심 있고 좋아하는 운동이나 실내 활동을
                                    알려주세요 (최대 5개 복수 선택).
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                                {INTEREST_OPTIONS.map((interest) => {
                                    const isSelected = interests.includes(
                                        interest.label,
                                    );
                                    return (
                                        <button
                                            key={interest.id}
                                            type="button"
                                            onClick={() =>
                                                handleInterestToggle(
                                                    interest.label,
                                                )
                                            }
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                                                isSelected
                                                    ? "bg-primary/5 border-primary text-primary shadow-sm"
                                                    : "bg-surface border-outline-variant hover:bg-surface-container"
                                            }`}
                                        >
                                            <span>{interest.label}</span>
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 6: Health Goals selection (AI Personalized customization) */}
                    {step === 6 && (
                        <motion.div
                            key="step-7"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <div>
                                <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-primary" />
                                    <span>6단계. 핵심 건강 목표 선택</span>
                                </h2>
                                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                                    이 목표를 바탕으로 AI 코치가 나에게 꼭 맞는
                                    피드백과 특별 일일 퀘스트를 도출합니다.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {HEALTH_GOAL_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setHealthGoal(opt.value)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                                            healthGoal === opt.value
                                                ? "bg-primary text-on-primary border-primary shadow-md"
                                                : "bg-surface border-outline-variant hover:bg-surface-container"
                                        }`}
                                    >
                                        <p className="text-xs font-bold">
                                            {opt.label}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleFinish}
                                className="w-full mt-6 bg-primary text-on-primary font-label-md text-sm py-3 rounded-full hover:bg-surface-tint active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25"
                            >
                                <span>가입 완료 및 AI 분석 시작</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 7: Custom AI Loader Screen */}
                    {step === 7 && (
                        <motion.div
                            key="step-8"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 space-y-6"
                        >
                            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-headline-md text-base font-extrabold text-primary animate-bounce">
                                    AI 웰니스 코치가 분석 중...
                                </h3>
                                <p className="font-body-md text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                                    {nickname} 학생의 신체 특징(BMI)과 평균 공부
                                    시간({studyHours}시간), 관심 카테고리를
                                    토대로 첫 일일 맞춤형 코칭 노트를 준비하고
                                    있습니다.
                                </p>
                            </div>

                            <div className="bg-surface p-4 rounded-2xl border border-outline-variant text-[11px] font-body-md text-left text-on-surface-variant space-y-1 max-w-xs mx-auto">
                                <p className="font-bold text-primary">
                                    💡 AI 분석 프리뷰:
                                </p>
                                <p>
                                    • BMI{" "}
                                    {(
                                        (weight as number) /
                                        ((height as number) / 100) ** 2
                                    ).toFixed(1)}{" "}
                                    기준 맞춤 걸음 수 추천
                                </p>
                                <p>
                                    •{" "}
                                    {studyHours >= 6
                                        ? "장시간 좌식에 대비한 허리 스트레칭 퀘스트 생성 중"
                                        : "균형 잡힌 운동 스케줄 배정 중"}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
