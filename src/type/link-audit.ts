export type LinkAuditResult =
    | "ok"
    | "http_error"     // 配合 statusCode, 比如404/403/500
    | "timeout"
    | "dns_failure"
    | "tls_error"
    | "unknown_error";

export type LinkAuditStatus = "pending" | "confirmed_dead" | "false_positive";

export type LinkAuditCandidate = {
    id: string;
    link: string;
    title: string;
    checkResult: LinkAuditResult;
    statusCode?: number;
    errorMessage?: string;
    checkedAt: string;
    status: LinkAuditStatus;
    note?: string; // 人工审查时填的备注
};