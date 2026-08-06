import { ConfigService } from '@nestjs/config';
import { ZKTecoService } from './zkteco.service';
import { IFingerprintService } from './fingerprint-service.interface';
export declare enum FingerprintDeviceType {
    ZKTECO = "ZKTECO",
    DIGITAL_PERSONA = "DIGITAL_PERSONA"
}
export declare class FingerprintServiceFactory {
    private configService;
    private zkTecoService;
    private digitalPersonaService;
    private readonly logger;
    private currentDeviceType;
    constructor(configService: ConfigService, zkTecoService: ZKTecoService, digitalPersonaService: IFingerprintService);
    getService(): IFingerprintService;
    switchDevice(deviceType: FingerprintDeviceType): Promise<void>;
    getCurrentDeviceType(): FingerprintDeviceType;
    getAllDevicesInfo(): Promise<{
        current: FingerprintDeviceType;
        devices: {
            ZKTECO: {
                type: FingerprintDeviceType;
                info: import("./fingerprint-service.interface").FingerprintDeviceInfo | {
                    connected: boolean;
                    model: string;
                };
                active: boolean;
            };
            DIGITAL_PERSONA: {
                type: FingerprintDeviceType;
                info: import("./fingerprint-service.interface").FingerprintDeviceInfo | {
                    connected: boolean;
                    model: string;
                };
                active: boolean;
            };
        };
    }>;
    testDeviceConnection(deviceType: FingerprintDeviceType): Promise<{
        success: boolean;
        message: string;
        info?: any;
    }>;
}
