import { ConfigService } from '@nestjs/config';
import { IFingerprintService, FingerprintDeviceInfo, FingerprintMatchResult } from './fingerprint-service.interface';
import { FingerprintMatcherClient } from './fingerprint-matcher-client.service';
export declare class DigitalPersonaService extends IFingerprintService {
    private configService;
    private readonly matcherClient;
    private readonly logger;
    private readonly matchingThreshold;
    private readonly minTemplateLength;
    private readonly useSourceAFIS;
    constructor(configService: ConfigService, matcherClient: FingerprintMatcherClient);
    getMatcherClient(): FingerprintMatcherClient;
    private checkMatcherHealth;
    validateFingerprintTemplate(template: string): boolean;
    normalizeTemplate(template: string): string;
    createTemplateHash(template: string): string;
    extractQuality(template: string): number;
    compareFingerprintTemplates(template1: string, template2: string): Promise<number>;
    private calculateBiometricSimilarity;
    private calculateHammingDistance;
    private countSetBits;
    private calculateStructuralSimilarity;
    private calculateCrossCorrelation;
    private calculateLocalBinaryPatterns;
    private extractLBP;
    matchFingerprints(template1: string, template2: string, threshold?: number): Promise<boolean>;
    matchFingerprintsWithScore(template1: string, template2: string, threshold?: number): Promise<FingerprintMatchResult>;
    connectToDevice(): Promise<boolean>;
    disconnectFromDevice(): Promise<void>;
    getDeviceInfo(): Promise<FingerprintDeviceInfo>;
    testConnection(): Promise<{
        success: boolean;
        message: string;
        info?: any;
    }>;
    enrollFingerprintOnDevice(employeeId: string, template: string): Promise<string>;
    deleteFingerprintFromDevice(deviceUserId: string): Promise<void>;
    syncFingerprintsToDevice(fingerprints: Array<{
        id: string;
        employeeId: string;
        fingerprintTemplate: string;
    }>): Promise<{
        success: number;
        failed: number;
    }>;
}
