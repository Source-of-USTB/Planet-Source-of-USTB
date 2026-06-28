export type LinkCheckResult =
    | "ok"
    | "http_error"     // 配合 statusCode, 比如404/403/500
    | "timeout"
    | "dns_failure"
    | "tls_error"
    | "unknown_error";

export type LinkCheckStatus = "pending" | "confirmed_dead" | "false_positive";

export type LinkCheckCandidate = {
    id: string;
    link: string;
    title: string;
    checkResult: LinkCheckResult;
    statusCode?: number;
    errorMessage?: string;
    checkedAt: string;
    status: LinkCheckStatus;
    note?: string; // 人工审查时填的备注
};