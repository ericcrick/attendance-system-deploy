import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export interface FingerprintComparisonResult {
    matched: boolean;
    score: number;
    percentage: number;
    threshold: number;
    message: string;
    minutiaeCount1: number;
    minutiaeCount2: number;
}
export interface FingerprintValidationResult {
    valid: boolean;
    minutiaeCount: number;
    message: string;
}
export interface FingerprintExtractionResult {
    success: boolean;
    template: string | null;
    minutiaeCount: number;
    message: string;
}
export declare class FingerprintMatcherClient {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly matcherServiceUrl;
    private readonly defaultThreshold;
    private isHealthy;
    constructor(httpService: HttpService, configService: ConfigService);
    private checkHealth;
    compare(template1: string, template2: string, customThreshold?: number): Promise<FingerprintComparisonResult>;
    validate(template: string): Promise<FingerprintValidationResult>;
    extractFromImage(imageBase64: string, format?: string): Promise<FingerprintExtractionResult>;
    healthCheck(): Promise<boolean>;
    getInfo(): Promise<any>;
    getIsHealthy(): boolean;
}
