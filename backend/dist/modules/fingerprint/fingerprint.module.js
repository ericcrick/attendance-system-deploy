"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const zkteco_service_1 = require("./zkteco.service");
const fingerprint_service_interface_1 = require("./fingerprint-service.interface");
;
const fingerprint_matcher_client_service_1 = require("./fingerprint-matcher-client.service");
const digitalpersona_service_1 = require("./digitalpersona.service");
let FingerprintModule = class FingerprintModule {
};
exports.FingerprintModule = FingerprintModule;
exports.FingerprintModule = FingerprintModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
        ],
        providers: [
            fingerprint_matcher_client_service_1.FingerprintMatcherClient,
            zkteco_service_1.ZKTecoService,
            digitalpersona_service_1.DigitalPersonaService,
            {
                provide: fingerprint_service_interface_1.IFingerprintService,
                useFactory: (config, digitalPersona, zkteco) => {
                    const deviceType = config
                        .get('FINGERPRINT_DEVICE_TYPE', 'DIGITAL_PERSONA')
                        ?.toUpperCase()
                        .replace(/[-\s]/g, '_');
                    console.log(`🔧 Active fingerprint service: ${deviceType}`);
                    return deviceType === 'ZKTECO' ? zkteco : digitalPersona;
                },
                inject: [config_1.ConfigService, digitalpersona_service_1.DigitalPersonaService, zkteco_service_1.ZKTecoService],
            },
        ],
        exports: [
            fingerprint_service_interface_1.IFingerprintService,
            digitalpersona_service_1.DigitalPersonaService,
            zkteco_service_1.ZKTecoService,
            fingerprint_matcher_client_service_1.FingerprintMatcherClient,
        ],
    })
], FingerprintModule);
//# sourceMappingURL=fingerprint.module.js.map