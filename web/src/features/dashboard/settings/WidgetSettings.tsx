import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GetDocument from "../../../utils/db/CRUD/GetDocument";
import UpdateDocument from "../../../utils/db/CRUD/UpdateDocument";
import type { UserDocument } from "../../auth/types";
import { useNavigate } from "react-router";
import {
    LayoutGrid,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Check,
    Sparkles,
} from "lucide-react";

interface WidgetInfo {
    id: string;
    title: string;
    description: string;
    gridSpan: string;
}

const AVAILABLE_WIDGETS: WidgetInfo[] = [
    {
        id: "score",
        title: "건강 점수 및 신체 캐릭터 카드",
        description: "성장 수준과 점수를 시각적으로 알려주는 핵심 컴포넌트",
        gridSpan: "가로 5칸 크기",
    },
    {
        id: "quests",
        title: "오늘의 퀘스트 완료 보드",
        description: "일일 걸음 수, 수분 공급, 스트레칭 성취 토글 리스트",
        gridSpan: "가로 4칸 크기",
    },
    {
        id: "steps",
        title: "목표 걸음 수 원형 프로그레스",
        description: "오늘의 남은 걸음 수와 AI 넛지 피드백 뱃지 박스",
        gridSpan: "가로 3칸 크기",
    },
    {
        id: "recs",
        title: "AI 코치 맞춤 인공지능 제안",
        description: "Gemini 기반 맞춤 행동 제안 및 실시간 브리핑",
        gridSpan: "가로 12칸 크기 (하단)",
    },
    {
        id: "chart",
        title: "이번 주 누적 활동 통계 차트",
        description: "월요일부터 일요일까지의 일일 성취량 막대 차트",
        gridSpan: "가로 7칸 크기",
    },
    {
        id: "ranking",
        title: "실시간 이용자 소셜 랭킹 보드",
        description:
            "나와 다른 MoveUp 유저들의 활동 데이터를 비교하는 랭킹보드",
        gridSpan: "가로 5칸 크기",
    },
    {
        id: "badges",
        title: "최근 획득한 업적 배지 아레나",
        description: "3일 연속, 만보 돌파 등으로 획득한 훈장들의 쇼케이스",
        gridSpan: "가로 12칸 크기 (하단)",
    },
];

export default function WidgetSettings() {
    const navigate = useNavigate();
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Ordered widget list in state
    const [activeWidgets, setActiveWidgets] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                try {
                    const docSnap = await GetDocument("users", user.uid);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserDocument;
                        setActiveWidgets(
                            data.dashboardLayout || [
                                "score",
                                "quests",
                                "steps",
                                "recs",
                                "chart",
                                "ranking",
                                "badges",
                            ],
                        );
                    }
                } catch (err) {
                    console.error("Failed to load widget settings:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/auth");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleToggleWidget = (widgetId: string) => {
        if (activeWidgets.includes(widgetId)) {
            // Must keep at least one widget active to prevent completely empty dashboard
            if (activeWidgets.length <= 1) return;
            setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));
        } else {
            setActiveWidgets([...activeWidgets, widgetId]);
        }
    };

    const handleMoveWidget = (index: number, direction: "up" | "down") => {
        const newOrder = [...activeWidgets];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newOrder.length) return;

        // Swap
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;

        setActiveWidgets(newOrder);
    };

    const handleSave = async () => {
        if (!uid) return;
        setSaving(true);
        try {
            await UpdateDocument("users", uid, {
                dashboardLayout: activeWidgets,
            });

            // Dispatch success alert
            const event = new CustomEvent("toast-message", {
                detail: {
                    text: "대시보드 위젯 순서 및 활성화 배치가 업데이트되었습니다.",
                    type: "success",
                },
            });
            window.dispatchEvent(event);
        } catch (err) {
            console.error("Failed to save widget layout:", err);
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

    // Find visible and hidden widgets
    const visibleWidgets = AVAILABLE_WIDGETS.filter((w) =>
        activeWidgets.includes(w.id),
    ).sort((a, b) => activeWidgets.indexOf(a.id) - activeWidgets.indexOf(b.id));

    const hiddenWidgets = AVAILABLE_WIDGETS.filter(
        (w) => !activeWidgets.includes(w.id),
    );

    return (
        <div className="space-y-6">
            <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="text-headline-sm font-bold text-on-surface mb-1 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    대시보드 위젯 활성화 및 순서 배치 설정
                </h2>
                <p className="text-body-md text-on-surface-variant">
                    나에게 필요 없는 정보를 끄고, 중요한 성과 카드를 우선 상단에
                    배치하는 드래그형 구조 맞춤화 서비스입니다.
                </p>
            </div>

            {/* Config Board */}
            <div className="space-y-6">
                {/* Active / Ordered Widgets */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                        대시보드 노출 위젯 순서 (위에서 아래 방향)
                    </h3>

                    <div className="space-y-2.5">
                        {visibleWidgets.map((widget, index) => (
                            <div
                                key={widget.id}
                                className="bg-surface border border-primary/20 hover:border-primary/50 p-4 rounded-2xl flex items-center justify-between transition-all shadow-xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-on-surface">
                                            {widget.title}
                                        </h4>
                                        <div className="flex gap-2 items-center mt-0.5">
                                            <span className="text-3xs text-on-surface-variant leading-none">
                                                {widget.description}
                                            </span>
                                            <span className="text-3xs bg-primary-container text-on-primary-container leading-none px-1 py-0.5 rounded-sm font-mono font-medium">
                                                {widget.gridSpan}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    {/* Move Buttons */}
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() =>
                                            handleMoveWidget(index, "up")
                                        }
                                        className="p-1.5 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-20 cursor-pointer"
                                        title="위로 이동"
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={
                                            index === visibleWidgets.length - 1
                                        }
                                        onClick={() =>
                                            handleMoveWidget(index, "down")
                                        }
                                        className="p-1.5 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-20 cursor-pointer"
                                        title="아래로 이동"
                                    >
                                        <ArrowDown className="h-3.5 w-3.5" />
                                    </button>

                                    {/* Hide Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleWidget(widget.id)
                                        }
                                        className="p-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer border border-rose-500/10"
                                        title="화면에서 감추기"
                                    >
                                        <EyeOff className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hidden Widgets Section */}
                {hiddenWidgets.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                        <h3 className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                            숨겨진 비활성 위젯 풀
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {hiddenWidgets.map((widget) => (
                                <div
                                    key={widget.id}
                                    className="bg-surface-container/30 border border-outline-variant/20 p-4 rounded-2xl flex items-center justify-between opacity-80 hover:opacity-100 transition-all"
                                >
                                    <div>
                                        <h4 className="text-xs font-bold text-on-surface-variant line-through">
                                            {widget.title}
                                        </h4>
                                        <p className="text-3xs text-on-surface-variant mt-0.5">
                                            {widget.description}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleWidget(widget.id)
                                        }
                                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl px-3 py-1.5 text-2xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <Eye className="h-3 w-3" />
                                        화면 추가
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer text-sm"
                >
                    {saving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Check className="h-4 w-4" />
                    )}
                    <span>배치 구도 저장하기</span>
                </button>
            </div>
        </div>
    );
}
