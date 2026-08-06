"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DigitalPersonaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalPersonaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const fingerprint_service_interface_1 = require("./fingerprint-service.interface");
const fingerprint_matcher_client_service_1 = require("./fingerprint-matcher-client.service");
let DigitalPersonaService = DigitalPersonaService_1 = class DigitalPersonaService extends fingerprint_service_interface_1.IFingerprintService {
    configService;
    matcherClient;
    logger = new common_1.Logger(DigitalPersonaService_1.name);
    matchingThreshold;
    minTemplateLength = 200;
    useSourceAFIS;
    constructor(configService, matcherClient) {
        super();
        this.configService = configService;
        this.matcherClient = matcherClient;
        this.matchingThreshold = this.configService.get('FINGERPRINT_MATCH_THRESHOLD', 85);
        this.useSourceAFIS = this.configService.get('USE_SOURCEAFIS_MATCHER', true);
        this.logger.log(`✅ DigitalPersona Service initialized (threshold: ${this.matchingThreshold}%, SourceAFIS: ${this.useSourceAFIS ? 'enabled' : 'disabled'})`);
        if (this.useSourceAFIS) {
            this.checkMatcherHealth();
        }
    }
    getMatcherClient() {
        return this.matcherClient;
    }
    async checkMatcherHealth() {
        const healthy = await this.matcherClient.healthCheck();
        if (healthy) {
            this.logger.log('✅ SourceAFIS matcher service is ready');
        }
        else {
            this.logger.warn('⚠️ SourceAFIS matcher service is not available - falling back to basic matching');
        }
    }
    validateFingerprintTemplate(template) {
        try {
            if (!template || typeof template !== 'string') {
                this.logger.warn('❌ Invalid: null or not string');
                return false;
            }
            const cleaned = template.trim();
            if (cleaned.length < this.minTemplateLength) {
                this.logger.warn(`❌ Too short: ${cleaned.length} < ${this.minTemplateLength}`);
                return false;
            }
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(cleaned)) {
                this.logger.warn('❌ Not valid base64');
                return false;
            }
            const decoded = Buffer.from(cleaned, 'base64');
            if (decoded.length === 0) {
                this.logger.warn('❌ Decodes to empty');
                return false;
            }
            this.logger.debug(`✅ Valid: ${cleaned.length} chars, ${decoded.length} bytes`);
            return true;
        }
        catch (error) {
            this.logger.error('❌ Validation error:', error);
            return false;
        }
    }
    normalizeTemplate(template) {
        return template.trim();
    }
    createTemplateHash(template) {
        const normalized = template.trim();
        return crypto.createHash('sha256').update(normalized).digest('hex');
    }
    extractQuality(template) {
        return 80;
    }
    async compareFingerprintTemplates(template1, template2) {
        try {
            if (!this.validateFingerprintTemplate(template1)) {
                throw new common_1.BadRequestException('Invalid template 1');
            }
            if (!this.validateFingerprintTemplate(template2)) {
                throw new common_1.BadRequestException('Invalid template 2');
            }
            const norm1 = this.normalizeTemplate(template1);
            const norm2 = this.normalizeTemplate(template2);
            this.logger.debug('═══════════════════════════════════════');
            this.logger.debug(`FINGERPRINT COMPARISON (${this.useSourceAFIS ? 'SourceAFIS' : 'Basic'})`);
            this.logger.debug(`Template 1: ${norm1.length} chars`);
            this.logger.debug(`Template 2: ${norm2.length} chars`);
            if (norm1 === norm2) {
                this.logger.debug('✅ EXACT STRING MATCH → 100%');
                return 100;
            }
            const hash1 = this.createTemplateHash(norm1);
            const hash2 = this.createTemplateHash(norm2);
            if (hash1 === hash2) {
                this.logger.debug('✅ HASH MATCH → 100%');
                return 100;
            }
            if (this.useSourceAFIS && this.matcherClient.getIsHealthy()) {
                try {
                    const result = await this.matcherClient.compare(norm1, norm2);
                    this.logger.debug(`📊 SourceAFIS Result: ${result.matched ? '✅ MATCHED' : '❌ NO MATCH'}`);
                    this.logger.debug(`📊 Score: ${result.score}, Percentage: ${result.percentage}%`);
                    this.logger.debug(`📊 Minutiae: ${result.minutiaeCount1} vs ${result.minutiaeCount2}`);
                    this.logger.debug('═══════════════════════════════════════');
                    return result.percentage;
                }
                catch (error) {
                    this.logger.warn(`⚠️ SourceAFIS comparison failed, falling back to basic matching`);
                }
            }
            const buffer1 = Buffer.from(norm1, 'base64');
            const buffer2 = Buffer.from(norm2, 'base64');
            this.logger.debug(`Buffer 1: ${buffer1.length} bytes`);
            this.logger.debug(`Buffer 2: ${buffer2.length} bytes`);
            const score = await this.calculateBiometricSimilarity(buffer1, buffer2);
            this.logger.debug(`📊 Basic similarity: ${score.toFixed(2)}%`);
            this.logger.debug('═══════════════════════════════════════');
            return score;
        }
        catch (error) {
            this.logger.error('❌ Comparison error:', error);
            return 0;
        }
    }
    async calculateBiometricSimilarity(buffer1, buffer2) {
        try {
            const hammingScore = this.calculateHammingDistance(buffer1, buffer2);
            const structuralScore = this.calculateStructuralSimilarity(buffer1, buffer2);
            const correlationScore = this.calculateCrossCorrelation(buffer1, buffer2);
            const lbpScore = this.calculateLocalBinaryPatterns(buffer1, buffer2);
            const weights = {
                hamming: 0.3,
                structural: 0.3,
                correlation: 0.25,
                lbp: 0.15,
            };
            const finalScore = hammingScore * weights.hamming +
                structuralScore * weights.structural +
                correlationScore * weights.correlation +
                lbpScore * weights.lbp;
            this.logger.debug(`🔬 Scores: Hamming=${hammingScore.toFixed(1)}%, Structural=${structuralScore.toFixed(1)}%, Correlation=${correlationScore.toFixed(1)}%, LBP=${lbpScore.toFixed(1)}%`);
            return Math.max(0, Math.min(100, finalScore));
        }
        catch (error) {
            this.logger.error('❌ Biometric calculation error:', error);
            return 0;
        }
    }
    calculateHammingDistance(buffer1, buffer2) {
        const minLength = Math.min(buffer1.length, buffer2.length);
        const maxLength = Math.max(buffer1.length, buffer2.length);
        if (minLength === 0)
            return 0;
        let matchingBits = 0;
        const totalBits = maxLength * 8;
        for (let i = 0; i < minLength; i++) {
            const xor = buffer1[i] ^ buffer2[i];
            const setBits = this.countSetBits(xor);
            matchingBits += 8 - setBits;
        }
        const lengthPenalty = ((maxLength - minLength) * 8) / totalBits;
        const score = (matchingBits / totalBits) * (1 - lengthPenalty * 0.3);
        return score * 100;
    }
    countSetBits(byte) {
        let count = 0;
        while (byte > 0) {
            count += byte & 1;
            byte >>= 1;
        }
        return count;
    }
    calculateStructuralSimilarity(buffer1, buffer2) {
        const minLength = Math.min(buffer1.length, buffer2.length);
        if (minLength < 16)
            return 0;
        const blockSize = 16;
        const numBlocks = Math.floor(minLength / blockSize);
        let matchingBlocks = 0;
        for (let i = 0; i < numBlocks; i++) {
            const offset = i * blockSize;
            let blockSimilarity = 0;
            for (let j = 0; j < blockSize; j++) {
                const diff = Math.abs(buffer1[offset + j] - buffer2[offset + j]);
                if (diff <= 10)
                    blockSimilarity++;
            }
            if (blockSimilarity >= 12) {
                matchingBlocks++;
            }
        }
        return (matchingBlocks / numBlocks) * 100;
    }
    calculateCrossCorrelation(buffer1, buffer2) {
        const minLength = Math.min(buffer1.length, buffer2.length);
        if (minLength < 8)
            return 0;
        const windowSize = Math.min(64, minLength);
        let maxCorrelation = 0;
        for (let offset = 0; offset < minLength - windowSize; offset += 8) {
            let correlation = 0;
            let sum1 = 0, sum2 = 0;
            for (let i = 0; i < windowSize; i++) {
                const val1 = buffer1[offset + i];
                const val2 = buffer2[offset + i];
                correlation += val1 * val2;
                sum1 += val1 * val1;
                sum2 += val2 * val2;
            }
            if (sum1 > 0 && sum2 > 0) {
                const normalizedCorr = correlation / Math.sqrt(sum1 * sum2);
                maxCorrelation = Math.max(maxCorrelation, normalizedCorr);
            }
        }
        return maxCorrelation * 100;
    }
    calculateLocalBinaryPatterns(buffer1, buffer2) {
        const minLength = Math.min(buffer1.length, buffer2.length);
        if (minLength < 9)
            return 0;
        let matchingPatterns = 0;
        const totalPatterns = minLength - 8;
        for (let i = 0; i < totalPatterns; i++) {
            const pattern1 = this.extractLBP(buffer1, i);
            const pattern2 = this.extractLBP(buffer2, i);
            if (pattern1 === pattern2) {
                matchingPatterns++;
            }
        }
        return (matchingPatterns / totalPatterns) * 100;
    }
    extractLBP(buffer, offset) {
        const center = buffer[offset + 4];
        let pattern = 0;
        const positions = [0, 1, 2, 5, 7, 6, 3, 1];
        for (let i = 0; i < 8; i++) {
            if (buffer[offset + positions[i]] >= center) {
                pattern |= 1 << i;
            }
        }
        return pattern;
    }
    async matchFingerprints(template1, template2, threshold) {
        const matchThreshold = threshold ?? this.matchingThreshold;
        const score = await this.compareFingerprintTemplates(template1, template2);
        const matched = score >= matchThreshold;
        this.logger.log(`${matched ? '✅' : '❌'} Match: ${score.toFixed(2)}% vs ${matchThreshold}% → ${matched ? 'PASS' : 'FAIL'}`);
        return matched;
    }
    async matchFingerprintsWithScore(template1, template2, threshold) {
        const matchThreshold = threshold ?? this.matchingThreshold;
        const score = await this.compareFingerprintTemplates(template1, template2);
        const matched = score >= matchThreshold;
        return {
            matched,
            score: Math.round(score * 100) / 100,
            threshold: matchThreshold,
        };
    }
    async connectToDevice() {
        return true;
    }
    async disconnectFromDevice() {
    }
    async getDeviceInfo() {
        return {
            connected: true,
            model: 'U.are.U 4500',
            manufacturer: 'DigitalPersona (HID Global)',
            sdkVersion: '5.2.0',
            status: 'Active',
        };
    }
    async testConnection() {
        try {
            const info = await this.getDeviceInfo();
            const matcherHealthy = this.useSourceAFIS
                ? await this.matcherClient.healthCheck()
                : true;
            const matcherInfo = matcherHealthy ? await this.matcherClient.getInfo() : null;
            return {
                success: matcherHealthy,
                message: matcherHealthy
                    ? 'Service and matcher operational'
                    : 'Service OK but matcher unavailable',
                info: {
                    ...info,
                    sourceAFIS: {
                        enabled: this.useSourceAFIS,
                        healthy: matcherHealthy,
                        info: matcherInfo,
                    },
                },
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Test failed: ${error.message}`,
            };
        }
    }
    async enrollFingerprintOnDevice(employeeId, template) {
        if (!this.validateFingerprintTemplate(template)) {
            throw new common_1.BadRequestException('Invalid template');
        }
        this.logger.log(`✅ Enrolled: ${employeeId} (${template.length} chars)`);
        return employeeId;
    }
    async deleteFingerprintFromDevice(deviceUserId) {
        this.logger.log(`🗑️ Deleted: ${deviceUserId}`);
    }
    async syncFingerprintsToDevice(fingerprints) {
        let success = 0;
        let failed = 0;
        for (const fp of fingerprints) {
            if (this.validateFingerprintTemplate(fp.fingerprintTemplate)) {
                success++;
            }
            else {
                failed++;
            }
        }
        this.logger.log(`🔄 Sync: ${success} OK, ${failed} failed`);
        return { success, failed };
    }
};
exports.DigitalPersonaService = DigitalPersonaService;
exports.DigitalPersonaService = DigitalPersonaService = DigitalPersonaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(fingerprint_matcher_client_service_1.FingerprintMatcherClient)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        fingerprint_matcher_client_service_1.FingerprintMatcherClient])
], DigitalPersonaService);
//# sourceMappingURL=digitalpersona.service.js.map