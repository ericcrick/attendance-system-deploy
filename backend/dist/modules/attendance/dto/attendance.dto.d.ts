import { AuthMethod } from '../../../common/enums';
export declare class ClockInDto {
    employeeId: string;
    method: AuthMethod;
    rfidCardId?: string;
    fingerprintTemplate?: string;
    fingerprintImage?: string;
    photoUrl?: string;
    location?: string;
}
export declare class ClockOutDto {
    employeeId: string;
    method: AuthMethod;
    rfidCardId?: string;
    fingerprintTemplate?: string;
    fingerprintImage?: string;
    photoUrl?: string;
    location?: string;
    notes?: string;
}
export declare class VerifyEmployeeDto {
    method: AuthMethod;
    rfidCardId?: string;
    employeeId?: string;
    fingerprintTemplate?: string;
    fingerprintImage?: string;
}
