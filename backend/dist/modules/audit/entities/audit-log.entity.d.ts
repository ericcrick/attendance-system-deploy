export declare class AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    entity: string;
    entityId?: string;
    description: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    result: string;
    errorMessage?: string;
    timestamp: Date;
}
