export interface UserDocument {
    uid: string;
    nickname: string;
    email: string;
    school?: string;
    grade?: string; // 중1, 중2, 중3, 고1, 고2, 고3
    birthYear?: number;
    gender?: "male" | "female" | "none";
    height: number;
    weight: number;
    exerciseLevel: "low" | "medium" | "high"; // 거의 안 함 (low), 주 1~2회/3~4회 (medium), 거의 매일 (high)
    studyHours: number; // 2시간 이하 (2), 3~5시간 (4), 6~8시간 (7), 9시간 이상 (10)
    targetSteps: number;
    targetExerciseMinutes: number;
    interests: string[];
    notificationEnabled: boolean;
    healthGoal: string; // "기초 체력을 기르고 싶어요", "운동 습관을 만들고 싶어요", "오래 앉아 있는 습관을 개선하고 싶어요", "규칙적인 생활을 하고 싶어요", "활력을 높이고 싶어요"
    profileImage?: string;
    accountMeta?: {
        signupMethod: "email" | "google";
        emailDomain: string;
        deviceType: string;
        browser: string;
        platform: string;
        language: string;
        timezone: string;
        screen: string;
        referrer: string;
        path: string;
        timestamp: string;
    };

    // Auto-generated stats
    healthScore: number;
    level: number;
    experience: number;
    streak: number;
    todaySteps: number;
    todayExerciseMinutes: number;
    completedQuests: string[];
    badges: string[];
    createdAt: string;
    updatedAt: string;

    // UI and sub-feature customizations (Backward compatibility + dynamic features)
    sleepTarget?: number; // hours
    waterTarget?: number; // glasses
    dietPreference?: "balanced" | "low-carb" | "high-protein" | "vegan" | "keto";
    theme?: string;
    dashboardLayout?: string[];
    enableAnimations?: boolean;
    notifications?: {
        push: boolean;
        questReminder: boolean;
        rankingAlert: boolean;
        weeklyReport: boolean;
        soundEnabled: boolean;
        quietMode: boolean;
        quietModeStart?: string;
        quietModeEnd?: string;
    };

    // New tracked statistics
    attendance?: string[]; // Dates in "YYYY-MM-DD"
    mealLogs?: {
        id: string;
        type: "breakfast" | "lunch" | "dinner" | "snack";
        name: string;
        calories: number;
        timestamp: string; // e.g., "08:30"
    }[];
    aiBriefingCache?: {
        date: string;
        text: string;
    };
    waterGlasses?: number; // number of water glasses drunk today
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    category: "steps" | "exercise" | "stretch" | "habit";
    rewardExp: number;
    completed: boolean;
}

export interface SchoolRank {
    name: string;
    averageSteps: number;
    totalStudents: number;
    rank: number;
}
