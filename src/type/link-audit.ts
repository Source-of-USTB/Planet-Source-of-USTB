export type LinkAuditResult =
    | "ok"
    | "http_error"     // 配合 statusCode, 比如404/403/500
    | "timeout"
    | "dns_failure"
    | "tls_error"
    | "unknown_error";

export const LINK_AUDIT_STATUSES = ["dead", "alive", "pending"] as const;
export type LinkAuditStatus = (typeof LINK_AUDIT_STATUSES)[number];
export const STATUS_DOC = LINK_AUDIT_STATUSES.join(" | ");

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

export type LinkAuditFile = {
    _statusValues: string;
    candidates: LinkAuditCandidate[];
};