export const getDeviceType = () => {
    if (typeof navigator === "undefined") {
        return "Unknown";
    }

    const userAgent = navigator.userAgent || "";

    // iOS 기기 판별
    if (/iPad|iPhone|iPod/.test(userAgent)) {
        if (/CriOS/.test(userAgent)) {
            return "iOS Chrome";
        } else if (/Safari/.test(userAgent) && !/CriOS/.test(userAgent)) {
            return "iOS Safari";
        } else if (/KAKAOTALK/.test(userAgent)) {
            return "iOS Kakao";
        } else {
            return "iOS";
        }
    }

    // Android 기기 판별
    if (/android/i.test(userAgent)) {
        if (/Chrome/.test(userAgent)) {
            return "Android Chrome";
        } else if (/SamsungBrowser/.test(userAgent)) {
            return "Android Samsung Browser";
        } else if (/KAKAOTALK/.test(userAgent)) {
            return "Android Kakao";
        } else {
            return "Android";
        }
    }

    // 웹 브라우저 판별
    return "Web";
};

export const getBrowserInfo = () => {
    if (typeof navigator === "undefined" || typeof window === "undefined") {
        return {
            deviceType: "Unknown",
            browser: "Unknown",
            platform: "Unknown",
            language: "ko-KR",
            timezone: "UTC",
            screen: "unknown",
            referrer: "unknown",
            path: "/",
            timestamp: new Date().toISOString(),
        };
    }

    const userAgent = navigator.userAgent || "";
    let browser = "Unknown";

    if (/Edg\//i.test(userAgent)) {
        browser = "Edge";
    } else if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) {
        browser = "Chrome";
    } else if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
        browser = "Safari";
    } else if (/Firefox\//i.test(userAgent)) {
        browser = "Firefox";
    } else if (/KAKAOTALK/i.test(userAgent)) {
        browser = "KakaoTalk";
    }

    return {
        deviceType: getDeviceType(),
        browser,
        platform: navigator.platform || "Unknown",
        language: navigator.language || "ko-KR",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        screen: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || "direct",
        path: window.location.pathname || "/",
        timestamp: new Date().toISOString(),
    };
};

export const getSignupContext = () => getBrowserInfo();
