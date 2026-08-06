import { AuthMethod, EmploymentStatus } from '../../../common/enums';
export declare class CreateEmployeeDto {
    employeeId: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email?: string;
    phone?: string;
    department: string;
    departmentId?: string;
    status?: EmploymentStatus;
    position?: string;
    designationId: string;
    postingId: string;
    yearOfEnlistment?: number;
    rfidCardId?: string;
    shiftId: string;
}
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    email?: string;
    phone?: string;
    department?: string;
    departmentId?: string;
    position?: string;
    designationId?: string;
    postingId?: string;
    yearOfEnlistment?: number;
    rfidCardId?: string;
    shiftId?: string;
    status?: EmploymentStatus;
    notes?: string;
    disabledAuthMethods?: AuthMethod[];
}
export declare class AssignRfidDto {
    rfidCardId: string;
}
export declare class AssignFingerprintDto {
    fingerprintTemplate: string;
    fingerprintImage?: string;
    fingerprintDeviceId?: string;
}
