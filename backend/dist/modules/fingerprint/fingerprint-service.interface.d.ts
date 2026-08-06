export interface FingerprintDeviceInfo {
    connected: boolean;
    model: string;
    manufacturer?: string;
    serialNumber?: string;
    firmware?: string;
    sdkVersion?: string;
    status?: string;
    ip?: string;
    port?: number;
}
export interface FingerprintTemplate {
    template: string;
    quality?: number;
    size?: number;
    format?: string;
}
export interface FingerprintScanResult {
    success: boolean;
    template?: string;
    quality?: number;
    error?: string;
    timestamp?: Date;
}
export interface FingerprintMatchResult {
    matched: boolean;
    score: number;
    threshold: number;
}
export declare abstract class IFingerprintService {
    abstract validateFingerprintTemplate(template: string): boolean;
    abstract compareFingerprintTemplates(template1: string, template2: string): Promise<number>;
    abstract matchFingerprints(template1: string, template2: string, threshold?: number): Promise<boolean>;
    abstract matchFingerprintsWithScore(template1: string, template2: string, threshold?: number): Promise<FingerprintMatchResult>;
    abstract connectToDevice(): Promise<boolean>;
    abstract disconnectFromDevice(): Promise<void>;
    abstract getDeviceInfo(): Promise<FingerprintDeviceInfo>;
    abstract testConnection(): Promise<{
        success: boolean;
        message: string;
        info?: any;
    }>;
    abstract enrollFingerprintOnDevice(employeeId: string, template: string): Promise<string>;
    abstract deleteFingerprintFromDevice(deviceUserId: string): Promise<void>;
    abstract syncFingerprintsToDevice(fingerprints: Array<{
        id: string;
        employeeId: string;
        fingerprintTemplate: string;
    }>): Promise<{
        success: number;
        failed: number;
    }>;
    abstract extractQuality(template: string): number;
    abstract normalizeTemplate(template: string): string;
    abstract createTemplateHash(template: string): string;
}
