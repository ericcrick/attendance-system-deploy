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
var ZKTecoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZKTecoService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const config_1 = require("@nestjs/config");
const fingerprint_service_interface_1 = require("./fingerprint-service.interface");
let ZKLib;
try {
    ZKLib = require('zklib');
    if (ZKLib.default) {
        ZKLib = ZKLib.default;
    }
    if (typeof ZKLib !== 'function' && ZKLib.ZKLib) {
        ZKLib = ZKLib.ZKLib;
    }
}
catch (error) {
    console.warn('ZKTeco library (zklib) not installed. ZKTeco features will be unavailable.');
    console.warn('Install with: npm install zklib');
    ZKLib = null;
}
let ZKTecoService = ZKTecoService_1 = class ZKTecoService extends fingerprint_service_interface_1.IFingerprintService {
    configService;
    logger = new common_1.Logger(ZKTecoService_1.name);
    deviceIp;
    devicePort;
    devicePassword;
    device = null;
    isConnected = false;
    reconnectAttempts = 0;
    maxReconnectAttempts = 3;
    isCapturing = false;
    captureCallback = null;
    captureInterval = null;
    zkLibAvailable = false;
    matchingThreshold;
    minTemplateLength = 100;
    constructor(configService) {
        super();
        this.configService = configService;
        this.deviceIp = this.configService.get('ZKTECO_DEVICE_IP', '192.168.1.201');
        this.devicePort = this.configService.get('ZKTECO_DEVICE_PORT', 4370);
        this.devicePassword = this.configService.get('ZKTECO_DEVICE_PASSWORD', '');
        this.matchingThreshold = this.configService.get('FINGERPRINT_MATCH_THRESHOLD', 60);
        this.zkLibAvailable = ZKLib !== null;
        this.logger.log(`ZKTeco Service initialized for device at ${this.deviceIp}:${this.devicePort}`);
        this.logger.log(`Library Available: ${this.zkLibAvailable}`);
        this.logger.log(`Match Threshold: ${this.matchingThreshold}%`);
    }
    validateFingerprintTemplate(template) {
        try {
            if (!template || typeof template !== 'string') {
                this.logger.warn('Invalid template: null or not a string');
                return false;
            }
            const cleaned = template.trim();
            if (cleaned.length < this.minTemplateLength) {
                this.logger.warn(`Template too short: ${cleaned.length} < ${this.minTemplateLength}`);
                return false;
            }
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$|^[A-Za-z0-9_-]*={0,2}$/;
            if (!base64Regex.test(cleaned)) {
                this.logger.warn('Template is not valid base64');
                return false;
            }
            const decoded = Buffer.from(cleaned, 'base64');
            if (decoded.length === 0) {
                this.logger.warn('Template decodes to empty buffer');
                return false;
            }
            const byteSize = decoded.length;
            if (byteSize < 400 || byteSize > 3000) {
                this.logger.warn(`Fingerprint template size out of range: ${byteSize} bytes (expected 400-3000)`);
                return false;
            }
            this.logger.debug(`Template validated: length=${cleaned.length}, decoded=${byteSize} bytes`);
            return true;
        }
        catch (error) {
            this.logger.error('Template validation error:', error);
            return false;
        }
    }
    createTemplateHash(template) {
        const normalized = template.trim();
        return crypto
            .createHash('sha256')
            .update(normalized)
            .digest('hex');
    }
    normalizeTemplate(template) {
        try {
            let normalized = template.trim();
            normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
            while (normalized.length % 4 !== 0) {
                normalized += '=';
            }
            return normalized;
        }
        catch (error) {
            this.logger.error('Template normalization error:', error);
            return template;
        }
    }
    extractQuality(template) {
        return 85;
    }
    async connectToDevice() {
        try {
            if (this.isConnected && this.device) {
                this.logger.log('Already connected to device');
                return true;
            }
            if (!this.zkLibAvailable) {
                this.logger.warn('ZKTeco library not available. Install with: npm install zklib');
                return false;
            }
            this.logger.log(`Attempting to connect to ZKTeco device at ${this.deviceIp}:${this.devicePort}`);
            this.device = new ZKLib(this.deviceIp, this.devicePort, 10000, 4000);
            await this.device.createSocket();
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.logger.log('✅ Successfully connected to ZKTeco device');
            const info = await this.getDeviceInfo();
            this.logger.log(`Device Info: ${JSON.stringify(info)}`);
            return true;
        }
        catch (error) {
            this.isConnected = false;
            this.logger.error(`❌ Failed to connect to ZKTeco device: ${error.message}`);
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                this.logger.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return this.connectToDevice();
            }
            return false;
        }
    }
    async disconnectFromDevice() {
        try {
            if (this.isCapturing) {
                await this.stopContinuousCapture();
            }
            if (this.device && this.isConnected) {
                await this.device.disconnect();
                this.isConnected = false;
                this.device = null;
                this.logger.log('🔌 Disconnected from ZKTeco device');
            }
        }
        catch (error) {
            this.logger.error('Error disconnecting from device:', error);
        }
    }
    async ensureConnection() {
        if (!this.isConnected) {
            const connected = await this.connectToDevice();
            if (!connected) {
                throw new common_1.BadRequestException('Unable to connect to fingerprint device');
            }
        }
    }
    async getDeviceInfo() {
        try {
            await this.ensureConnection();
            const info = await this.device.getInfo();
            const version = await this.device.getVersion();
            const platform = await this.device.getPlatform();
            const users = await this.device.getUsers();
            const userCount = users ? users.data.length : 0;
            return {
                connected: this.isConnected,
                model: platform || 'ZKTeco',
                manufacturer: 'ZKTeco',
                serialNumber: info?.serialNumber || 'Unknown',
                firmware: version || 'Unknown',
                ip: this.deviceIp,
                port: this.devicePort,
            };
        }
        catch (error) {
            this.logger.error('Failed to get device info:', error);
            return {
                connected: false,
                model: 'ZKTeco',
                manufacturer: 'ZKTeco',
                ip: this.deviceIp,
                port: this.devicePort,
            };
        }
    }
    async compareFingerprintTemplates(template1, template2) {
        try {
            if (!this.validateFingerprintTemplate(template1) ||
                !this.validateFingerprintTemplate(template2)) {
                throw new common_1.BadRequestException('Invalid fingerprint template');
            }
            const norm1 = this.normalizeTemplate(template1);
            const norm2 = this.normalizeTemplate(template2);
            if (norm1 === norm2) {
                this.logger.debug('Exact template match found');
                return 100;
            }
            const buffer1 = Buffer.from(norm1, 'base64');
            const buffer2 = Buffer.from(norm2, 'base64');
            return this.calculateTemplateSimilarity(buffer1, buffer2);
        }
        catch (error) {
            this.logger.error('Fingerprint comparison error:', error);
            return 0;
        }
    }
    calculateTemplateSimilarity(buffer1, buffer2) {
        try {
            const minLength = Math.min(buffer1.length, buffer2.length);
            const maxLength = Math.max(buffer1.length, buffer2.length);
            if (minLength === 0)
                return 0;
            let matchingBits = 0;
            const totalBits = minLength * 8;
            for (let i = 0; i < minLength; i++) {
                const xor = buffer1[i] ^ buffer2[i];
                matchingBits += 8 - this.countSetBits(xor);
            }
            const matchRate = matchingBits / totalBits;
            const lengthPenalty = (maxLength - minLength) / maxLength;
            const similarity = matchRate * (1 - lengthPenalty * 0.3);
            const finalScore = Math.round(similarity * 10000) / 100;
            this.logger.debug(`Similarity: ${finalScore}% (match rate: ${(matchRate * 100).toFixed(2)}%, length penalty: ${(lengthPenalty * 100).toFixed(2)}%)`);
            return finalScore;
        }
        catch (error) {
            this.logger.error('Error calculating template similarity:', error);
            return 0;
        }
    }
    countSetBits(byte) {
        let count = 0;
        while (byte) {
            count += byte & 1;
            byte >>= 1;
        }
        return count;
    }
    async matchFingerprints(template1, template2, threshold) {
        const matchThreshold = threshold ?? this.matchingThreshold;
        const score = await this.compareFingerprintTemplates(template1, template2);
        this.logger.debug(`Fingerprint match: score=${score}%, threshold=${matchThreshold}%, matched=${score >= matchThreshold}`);
        return score >= matchThreshold;
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
    async captureFingerprintTemplate() {
        try {
            if (!this.isConnected) {
                const connected = await this.connectToDevice();
                if (!connected) {
                    return {
                        success: false,
                        error: 'Device not connected',
                    };
                }
            }
            this.logger.log('👆 Waiting for fingerprint scan on ZKTeco device...');
            return await new Promise((resolve) => {
                let resolved = false;
                const timeout = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve({
                            success: false,
                            error: 'Capture timeout - no finger detected',
                        });
                    }
                }, 30000);
                this.enableRealTimeMonitoring((data) => {
                    if (!resolved && data.template) {
                        resolved = true;
                        clearTimeout(timeout);
                        let template = data.template;
                        if (Buffer.isBuffer(template)) {
                            template = template.toString('base64');
                        }
                        resolve({
                            success: true,
                            template: template,
                            quality: 85,
                            timestamp: new Date(),
                        });
                        this.disableRealTimeMonitoring();
                    }
                }).catch((error) => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        resolve({
                            success: false,
                            error: error.message,
                        });
                    }
                });
            });
        }
        catch (error) {
            this.logger.error('Capture error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async startContinuousCapture(callback) {
        try {
            if (!this.isConnected) {
                await this.connectToDevice();
            }
            if (this.isCapturing) {
                this.logger.warn('Already capturing');
                return;
            }
            this.captureCallback = callback;
            this.isCapturing = true;
            this.logger.log('🔄 Starting continuous fingerprint capture on ZKTeco...');
            await this.enableRealTimeMonitoring((data) => {
                if (data.template && this.captureCallback) {
                    let template = data.template;
                    if (Buffer.isBuffer(template)) {
                        template = template.toString('base64');
                    }
                    this.captureCallback({
                        success: true,
                        template: template,
                        quality: 85,
                        timestamp: new Date(),
                    });
                }
            });
        }
        catch (error) {
            this.isCapturing = false;
            this.logger.error('Failed to start continuous capture:', error);
            throw error;
        }
    }
    async stopContinuousCapture() {
        try {
            if (!this.isCapturing) {
                return;
            }
            this.logger.log('⏹️ Stopping continuous capture...');
            await this.disableRealTimeMonitoring();
            if (this.captureInterval) {
                clearInterval(this.captureInterval);
                this.captureInterval = null;
            }
            this.isCapturing = false;
            this.captureCallback = null;
            this.logger.log('✓ Continuous capture stopped');
        }
        catch (error) {
            this.logger.error('Error stopping capture:', error);
            this.isCapturing = false;
            this.captureCallback = null;
        }
    }
    async enrollFingerprintOnDevice(employeeId, fingerprintTemplate) {
        try {
            await this.ensureConnection();
            if (!this.validateFingerprintTemplate(fingerprintTemplate)) {
                throw new common_1.BadRequestException('Invalid fingerprint template');
            }
            const normalizedTemplate = this.normalizeTemplate(fingerprintTemplate);
            const templateBuffer = Buffer.from(normalizedTemplate, 'base64');
            const timestamp = Date.now();
            const deviceUserId = (timestamp % 1000000).toString();
            this.logger.log(`📝 Enrolling fingerprint for employee ${employeeId} with device ID ${deviceUserId}`);
            const userData = {
                uid: parseInt(deviceUserId),
                userId: employeeId,
                name: employeeId,
                password: '',
                role: 0,
                cardno: 0,
            };
            await this.device.setUser(userData);
            const templateData = {
                uid: parseInt(deviceUserId),
                fid: 0,
                valid: 1,
                template: templateBuffer,
            };
            await this.device.setTemplate(templateData);
            this.logger.log(`✅ Successfully enrolled fingerprint for ${employeeId}`);
            return deviceUserId;
        }
        catch (error) {
            this.logger.error(`❌ Device enrollment error for ${employeeId}:`, error);
            throw new common_1.BadRequestException(`Failed to enroll fingerprint on device: ${error.message}`);
        }
    }
    async deleteFingerprintFromDevice(deviceUserId) {
        try {
            await this.ensureConnection();
            this.logger.log(`🗑️ Deleting fingerprint with device ID: ${deviceUserId}`);
            await this.device.deleteUser(parseInt(deviceUserId));
            this.logger.log(`✅ Successfully deleted fingerprint for device ID ${deviceUserId}`);
        }
        catch (error) {
            this.logger.error(`❌ Device deletion error for ${deviceUserId}:`, error);
            throw new common_1.BadRequestException(`Failed to delete fingerprint from device: ${error.message}`);
        }
    }
    async syncFingerprintsToDevice(employees) {
        let success = 0;
        let failed = 0;
        this.logger.log(`🔄 Starting sync of ${employees.length} fingerprints to device`);
        try {
            await this.ensureConnection();
            for (const employee of employees) {
                try {
                    if (!employee.fingerprintTemplate) {
                        continue;
                    }
                    await this.enrollFingerprintOnDevice(employee.employeeId, employee.fingerprintTemplate);
                    success++;
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
                catch (error) {
                    failed++;
                    this.logger.error(`Failed to sync ${employee.employeeId}:`, error);
                }
            }
            this.logger.log(`✅ Sync completed. Success: ${success}, Failed: ${failed}`);
        }
        catch (error) {
            this.logger.error('Sync operation failed:', error);
            throw new common_1.BadRequestException(`Sync operation failed: ${error.message}`);
        }
        return { success, failed };
    }
    async testConnection() {
        try {
            const connected = await this.connectToDevice();
            if (!connected) {
                return {
                    success: false,
                    message: 'Failed to connect to ZKTeco device',
                };
            }
            const info = await this.getDeviceInfo();
            return {
                success: true,
                message: 'Successfully connected to ZKTeco device',
                info,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Connection test failed: ${error.message}`,
            };
        }
    }
    async getAllUsersFromDevice() {
        try {
            await this.ensureConnection();
            const users = await this.device.getUsers();
            return users?.data || [];
        }
        catch (error) {
            this.logger.error('Failed to get users from device:', error);
            return [];
        }
    }
    async getAllTemplatesFromDevice() {
        try {
            await this.ensureConnection();
            const templates = await this.device.getTemplates();
            return templates?.data || [];
        }
        catch (error) {
            this.logger.error('Failed to get templates from device:', error);
            return [];
        }
    }
    async enableRealTimeMonitoring(callback) {
        try {
            await this.ensureConnection();
            this.logger.log('🔍 Enabling real-time monitoring');
            this.device.on('realtime_log', (data) => {
                this.logger.debug('Real-time log event:', data);
                callback(data);
            });
            await this.device.enableRealtime();
        }
        catch (error) {
            this.logger.error('Failed to enable real-time monitoring:', error);
            throw new common_1.BadRequestException(`Failed to enable real-time monitoring: ${error.message}`);
        }
    }
    async disableRealTimeMonitoring() {
        try {
            if (this.device && this.isConnected) {
                await this.device.disableRealtime();
                this.logger.log('⏹️ Real-time monitoring disabled');
            }
        }
        catch (error) {
            this.logger.error('Failed to disable real-time monitoring:', error);
        }
    }
    async clearAllDataFromDevice() {
        try {
            await this.ensureConnection();
            this.logger.log('🗑️ Clearing all data from device');
            await this.device.clearAttendanceLog();
            const users = await this.getAllUsersFromDevice();
            for (const user of users) {
                await this.device.deleteUser(user.uid);
            }
            this.logger.log('✅ Successfully cleared all data from device');
            return true;
        }
        catch (error) {
            this.logger.error('Failed to clear device data:', error);
            return false;
        }
    }
    async getAttendanceLogs() {
        try {
            await this.ensureConnection();
            const logs = await this.device.getAttendances();
            if (!logs || !logs.data) {
                return [];
            }
            return logs.data.map((log) => ({
                userId: log.userId,
                deviceUserId: log.deviceUserId,
                timestamp: log.recordTime,
                type: log.type,
                verifyType: log.verifyType,
            }));
        }
        catch (error) {
            this.logger.error('Failed to get attendance logs:', error);
            return [];
        }
    }
    async onModuleDestroy() {
        await this.disconnectFromDevice();
    }
};
exports.ZKTecoService = ZKTecoService;
exports.ZKTecoService = ZKTecoService = ZKTecoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ZKTecoService);
//# sourceMappingURL=zkteco.service.js.map