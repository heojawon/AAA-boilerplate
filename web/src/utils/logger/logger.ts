export type LoggerType = "info" | "warn" | "error";

export function logger(subject: string, type: LoggerType, ...text: string[]) {
    const message = text.join(" ");

    switch (type) {
        case "error":
            console.error(`[${subject}]: ${message}`);
            break;
        case "warn":
            console.warn(`[${subject}]: ${message}`);
            break;
        case "info":
            console.info(`[${subject}]: ${message}`);
            break;
        default:
            console.log(`[${subject}]: ${message}`);
    }
}
