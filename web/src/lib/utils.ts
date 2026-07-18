import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSignupContext } from "./finduserAgent";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function buildSignupMetadata() {
    const context = getSignupContext();

    return {
        signupMethod: "email",
        deviceType: context.deviceType,
        browser: context.browser,
        platform: context.platform,
        language: context.language,
        timezone: context.timezone,
        screen: context.screen,
        referrer: context.referrer,
        path: context.path,
        timestamp: context.timestamp,
    };
}
