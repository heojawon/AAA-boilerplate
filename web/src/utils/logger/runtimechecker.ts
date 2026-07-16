import { logger } from "./logger";

const timerMap = new Map<string, number>();

/**
 * 실행 시간 측정 시작
 * @param label 측정할 작업의 고유 이름
 */
export function runtimeMeasureStart(label: string = "default"): void {
    if (timerMap.has(label)) {
        logger(
            "RuntimeChecker",
            "warn",
            "측정 시작 구분자가 일치합니다.",
            label,
        );
    }
    // 현재 시점의 정밀 시간(ms)을 기록실에 저장
    timerMap.set(label, performance.now());
}

/**
 * 실행 시간 측정 종료
 * @param label 종료할 작업의 고유 이름
 * @returns 측정된 실행 시간 ms
 */
export function runtimeMeasureEnd(label: string = "default"): number {
    const startTime = timerMap.get(label);

    if (startTime === undefined) {
        logger(
            "RuntimeChecker",
            "warn",
            "일치하는 측정 시작 구분자를 찾을 수 없습니다.",
            label,
        );
        return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    timerMap.delete(label);

    console.log(
        `${label} 작업 은/는 ${duration.toFixed(2)}ms초로 종료되었습니다.`,
    );
    return duration;
}
