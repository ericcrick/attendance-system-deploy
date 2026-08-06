"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FingerprintMatcherClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintMatcherClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let FingerprintMatcherClient = FingerprintMatcherClient_1 = class FingerprintMatcherClient {
    httpService;
    configService;
    logger = new common_1.Logger(FingerprintMatcherClient_1.name);
    matcherServiceUrl;
    defaultThreshold;
    isHealthy = false;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.matcherServiceUrl = this.configService.get('FINGERPRINT_MATCHER_URL', 'http://localhost:5000/api/fingerprint');
        this.defaultThreshold = this.configService.get('SOURCEAFIS_THRESHOLD', 20.0);
        this.logger.log(`🔗 SourceAFIS Matcher URL: ${this.matcherServiceUrl}`);
        this.logger.log(`🎯 Default threshold: ${this.defaultThreshold}`);
        this.checkHealth();
    }
    async checkHealth() {
        try {
            const healthy = await this.healthCheck();
            this.isHealthy = healthy;
            if (healthy) {
                this.logger.log('✅ SourceAFIS matcher service is healthy');
            }
            else {
                this.logger.warn('⚠️ SourceAFIS matcher service is not available');
            }
        }
        catch (error) {
            this.isHealthy = false;
            this.logger.warn('⚠️ Failed to check SourceAFIS matcher health');
        }
    }
    async compare(template1, template2, customThreshold) {
        try {
            this.logger.debug(`📤 Sending templates to SourceAFIS matcher (${template1.length} vs ${template2.length} chars)`);
            const endpoint = customThreshold
                ? `${this.matcherServiceUrl}/compare-with-threshold?threshold=${customThreshold}`
                : `${this.matcherServiceUrl}/compare`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(endpoint, {
                template1,
                template2,
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            const result = response.data;
            this.logger.log(`📥 ${result.matched ? '✅ MATCHED' : '❌ NO MATCH'} - Score: ${result.score.toFixed(2)}, Threshold: ${result.threshold}, Minutiae: ${result.minutiaeCount1}/${result.minutiaeCount2}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ SourceAFIS matcher error:`, error.message);
            return {
                matched: false,
                score: 0,
                percentage: 0,
                threshold: customThreshold || this.defaultThreshold,
                message: `Matcher service error: ${error.message}`,
                minutiaeCount1: 0,
                minutiaeCount2: 0,
            };
        }
    }
    async validate(template) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.matcherServiceUrl}/validate`, { template }, { timeout: 5000 }));
            this.logger.debug(`🔍 Validation: ${response.data.valid ? '✅' : '❌'} - ${response.data.minutiaeCount} minutiae`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`❌ Validation error:`, error.message);
            return {
                valid: false,
                minutiaeCount: 0,
                message: `Validation failed: ${error.message}`,
            };
        }
    }
    async extractFromImage(imageBase64, format = 'png') {
        try {
            this.logger.debug(`🖼️ Extracting template from ${format} image...`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.matcherServiceUrl}/extract`, {
                imageBase64,
                format,
            }, { timeout: 15000 }));
            this.logger.log(`🖼️ Extraction: ${response.data.success ? '✅' : '❌'} - ${response.data.minutiaeCount} minutiae`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`❌ Extraction error:`, error.message);
            return {
                success: false,
                template: null,
                minutiaeCount: 0,
                message: `Extraction failed: ${error.message}`,
            };
        }
    }
    async healthCheck() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.matcherServiceUrl}/health`, {
                timeout: 3000,
            }));
            this.isHealthy = response.status === 200;
            return this.isHealthy;
        }
        catch (error) {
            this.isHealthy = false;
            return false;
        }
    }
    async getInfo() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.matcherServiceUrl}/info`, {
                timeout: 3000,
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`❌ Failed to get service info:`, error);
            return null;
        }
    }
    getIsHealthy() {
        return this.isHealthy;
    }
};
exports.FingerprintMatcherClient = FingerprintMatcherClient;
exports.FingerprintMatcherClient = FingerprintMatcherClient = FingerprintMatcherClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], FingerprintMatcherClient);
//# sourceMappingURL=fingerprint-matcher-client.service.js.map