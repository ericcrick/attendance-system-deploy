import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFingerprintService, FingerprintDeviceInfo, FingerprintScanResult, FingerprintMatchResult } from './fingerprint-service.interface';
export declare class ZKTecoService extends IFingerprintService implements OnModuleDestroy {
    private configService;
    private readonly logger;
    private deviceIp;
    private devicePort;
    private devicePassword;
    private device;
    private isConnected;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private isCapturing;
    private captureCallback;
    private captureInterval;
    private zkLibAvailable;
    private matchingThreshold;
    private readonly minTemplateLength;
    constructor(configService: ConfigService);
    validateFingerprintTemplate(template: string): boolean;
    createTemplateHash(template: string): string;
    normalizeTemplate(template: string): string;
    extractQuality(template: string): number;
    connectToDevice(): Promise<boolean>;
    disconnectFromDevice(): Promise<void>;
    private ensureConnection;
    getDeviceInfo(): Promise<FingerprintDeviceInfo>;
    compareFingerprintTemplates(template1: string, template2: string): Promise<number>;
    private calculateTemplateSimilarity;
    private countSetBits;
    matchFingerprints(template1: string, template2: string, threshold?: number): Promise<boolean>;
    matchFingerprintsWithScore(template1: string, template2: string, threshold?: number): Promise<FingerprintMatchResult>;
    captureFingerprintTemplate(): Promise<FingerprintScanResult>;
    startContinuousCapture(callback: (result: FingerprintScanResult) => void): Promise<void>;
    stopContinuousCapture(): Promise<void>;
    enrollFingerprintOnDevice(employeeId: string, fingerprintTemplate: string): Promise<string>;
    deleteFingerprintFromDevice(deviceUserId: string): Promise<void>;
    syncFingerprintsToDevice(employees: Array<{
        id: string;
        employeeId: string;
        fingerprintTemplate: string;
    }>): Promise<{
        success: number;
        failed: number;
    }>;
    testConnection(): Promise<{
        success: boolean;
        message: string;
        info?: any;
    }>;
    getAllUsersFromDevice(): Promise<any[]>;
    getAllTemplatesFromDevice(): Promise<any[]>;
    private enableRealTimeMonitoring;
    private disableRealTimeMonitoring;
    clearAllDataFromDevice(): Promise<boolean>;
    getAttendanceLogs(): Promise<any[]>;
    onModuleDestroy(): Promise<void>;
}
