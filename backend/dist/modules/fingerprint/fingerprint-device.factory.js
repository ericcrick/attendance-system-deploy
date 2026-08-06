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
var FingerprintServiceFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintServiceFactory = exports.FingerprintDeviceType = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zkteco_service_1 = require("./zkteco.service");
const fingerprint_service_interface_1 = require("./fingerprint-service.interface");
var FingerprintDeviceType;
(function (FingerprintDeviceType) {
    FingerprintDeviceType["ZKTECO"] = "ZKTECO";
    FingerprintDeviceType["DIGITAL_PERSONA"] = "DIGITAL_PERSONA";
})(FingerprintDeviceType || (exports.FingerprintDeviceType = FingerprintDeviceType = {}));
let FingerprintServiceFactory = FingerprintServiceFactory_1 = class FingerprintServiceFactory {
    configService;
    zkTecoService;
    digitalPersonaService;
    logger = new common_1.Logger(FingerprintServiceFactory_1.name);
    currentDeviceType;
    constructor(configService, zkTecoService, digitalPersonaService) {
        this.configService = configService;
        this.zkTecoService = zkTecoService;
        this.digitalPersonaService = digitalPersonaService;
        const deviceType = this.configService
            .get('FINGERPRINT_DEVICE_TYPE', 'DIGITAL_PERSONA')
            .toUpperCase()
            .replace('-', '_');
        this.currentDeviceType =
            FingerprintDeviceType[deviceType] || FingerprintDeviceType.DIGITAL_PERSONA;
        this.logger.log(`Fingerprint device initialized: ${this.currentDeviceType}`);
    }
    getService() {
        switch (this.currentDeviceType) {
            case FingerprintDeviceType.ZKTECO:
                return this.zkTecoService;
            case FingerprintDeviceType.DIGITAL_PERSONA:
                return this.digitalPersonaService;
            default:
                this.logger.warn(`Unknown device type: ${this.currentDeviceType}, defaulting to DigitalPersona`);
                return this.digitalPersonaService;
        }
    }
    async switchDevice(deviceType) {
        this.logger.log(`Switching fingerprint device from ${this.currentDeviceType} to ${deviceType}`);
        const currentService = this.getService();
        await currentService.disconnectFromDevice();
        this.currentDeviceType = deviceType;
        const newService = this.getService();
        await newService.connectToDevice();
        this.logger.log(`✓ Switched to ${deviceType}`);
    }
    getCurrentDeviceType() {
        return this.currentDeviceType;
    }
    async getAllDevicesInfo() {
        const [zktecoInfo, digitalPersonaInfo] = await Promise.all([
            this.zkTecoService.getDeviceInfo().catch(() => ({
                connected: false,
                model: 'ZKTeco',
            })),
            this.digitalPersonaService.getDeviceInfo().catch(() => ({
                connected: false,
                model: 'DigitalPersona U.are.U 4500',
            })),
        ]);
        return {
            current: this.currentDeviceType,
            devices: {
                ZKTECO: {
                    type: FingerprintDeviceType.ZKTECO,
                    info: zktecoInfo,
                    active: this.currentDeviceType === FingerprintDeviceType.ZKTECO,
                },
                DIGITAL_PERSONA: {
                    type: FingerprintDeviceType.DIGITAL_PERSONA,
                    info: digitalPersonaInfo,
                    active: this.currentDeviceType === FingerprintDeviceType.DIGITAL_PERSONA,
                },
            },
        };
    }
    async testDeviceConnection(deviceType) {
        const service = deviceType === FingerprintDeviceType.ZKTECO
            ? this.zkTecoService
            : this.digitalPersonaService;
        return await service.testConnection();
    }
};
exports.FingerprintServiceFactory = FingerprintServiceFactory;
exports.FingerprintServiceFactory = FingerprintServiceFactory = FingerprintServiceFactory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        zkteco_service_1.ZKTecoService,
        fingerprint_service_interface_1.IFingerprintService])
], FingerprintServiceFactory);
//# sourceMappingURL=fingerprint-device.factory.js.map