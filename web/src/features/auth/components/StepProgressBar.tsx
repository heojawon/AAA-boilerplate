import React from "react";
import { Check } from "lucide-react";

interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
    onStepClick?: (step: number) => void;
}

export default function StepProgressBar({
    currentStep,
    totalSteps,
    onStepClick,
}: StepProgressBarProps) {
    const steps = [
        { label: "계정", desc: "계정 설정" },
        { label: "프로필", desc: "기본 프로필" },
        { label: "건강", desc: "건강 정보 입력" },
        { label: "목표", desc: "일일 목표 설정" },
        { label: "관심사", desc: "운동 관심사 선택" },
        { label: "최종", desc: "최종 목표 선택" },
    ];

    return (
        <div className="w-full" id="step-progress-bar-container">
            {/* Step Nodes & Connective Progress Line */}
            <div
                className="flex items-center justify-between w-full relative mb-5 px-2"
                id="step-circles-row"
            >
                {/* Background Grey Line */}
                <div className="absolute top-[18px] left-[20px] right-[20px] h-1 bg-surface-container-highest -translate-y-1/2 z-0 rounded-full" />

                {/* Active Colored Progress Line */}
                <div
                    className="absolute top-[18px] left-[20px] h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-out rounded-full"
                    style={{
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                        maxWidth: "calc(100% - 40px)",
                    }}
                />

                {steps.map((s, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    const isFuture = stepNum > currentStep;

                    return (
                        <button
                            key={stepNum}
                            type="button"
                            disabled={!onStepClick || isFuture}
                            onClick={() => onStepClick?.(stepNum)}
                            className={`relative z-10 flex flex-col items-center focus:outline-none transition-all duration-300 ${
                                onStepClick && !isFuture
                                    ? "cursor-pointer hover:scale-105 active:scale-95"
                                    : "cursor-default"
                            }`}
                            id={`step-node-${stepNum}`}
                        >
                            {/* Circle Bubble */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-extrabold transition-all duration-300 border-2 ${
                                    isCompleted
                                        ? "bg-primary border-primary text-on-primary shadow-md shadow-primary/10"
                                        : isActive
                                          ? "bg-surface-container-lowest border-primary text-primary shadow-lg ring-4 ring-primary-container/30"
                                          : "bg-surface-container border-outline-variant text-on-surface-variant/70"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-4.5 w-4.5 stroke-[3.5]" />
                                ) : (
                                    <span>{stepNum}</span>
                                )}
                            </div>

                            {/* Step label text below nodes (Desktop & Tablet) */}
                            <span
                                className={`text-[11px] mt-2 font-display font-semibold tracking-tight hidden sm:block transition-all duration-300 ${
                                    isActive
                                        ? "text-primary font-bold scale-105"
                                        : isCompleted
                                          ? "text-on-surface font-semibold"
                                          : "text-on-surface-variant/50"
                                }`}
                            >
                                {s.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Info banner for Mobile screens (Clean and visual) */}
            <div
                className="flex justify-between items-center bg-surface-container-low px-4 py-2.5 rounded-2xl border border-outline-variant/30 sm:hidden"
                id="mobile-step-info"
            >
                <span className="text-xs font-bold text-primary font-display flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    {currentStep}단계: {steps[currentStep - 1]?.desc}
                </span>
                <span className="text-xs font-mono font-extrabold text-on-surface-variant/80 bg-surface-container px-2 py-0.5 rounded-lg">
                    {currentStep} / {totalSteps}
                </span>
            </div>

            {/* Info text for Desktop/Tablet screens (Balanced typography) */}
            <div
                className="hidden sm:flex justify-between items-center px-1 text-xs text-on-surface-variant font-medium"
                id="desktop-step-info"
            >
                <span className="flex items-center gap-1">
                    현재 단계:{" "}
                    <strong className="text-primary font-bold">
                        {steps[currentStep - 1]?.desc}
                    </strong>
                </span>
                <span className="font-mono text-primary font-extrabold bg-primary/10 px-2 py-0.5 rounded-full">
                    {currentStep} / {totalSteps} 완료
                </span>
            </div>
        </div>
    );
}
