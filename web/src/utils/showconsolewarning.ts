export function showConsoleWarning() {
    console.log(
        "%cDeveloper Console Notice",
        `
        color:#5865F2;
        font-size:28px;
        font-weight:bold;
        `,
    );

    console.log(
        `%c
서비스 상태 및 디버깅 로그 메시지만 표시됩니다.
알 수 없는 출처의 코드를 붙여넣거나 실행하지 않도록 주의해 주세요.

This console is provided for development and debugging purposes.
You may open and use the console.
Only service status and debugging log messages are displayed here.
Please avoid pasting or executing code from unknown sources.
        `,
        `
        font-size:14px;
        line-height:1.8;
        `,
    );
}

export default showConsoleWarning;
