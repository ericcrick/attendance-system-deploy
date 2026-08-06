import { AuthMethod, AttendanceStatus } from '../../../common/enums';
import { Employee } from '../../employees/entities/employee.entity';
export declare class Attendance {
    id: string;
    employeeId: string;
    employee: Employee;
    clockInTime: Date;
    clockOutTime?: Date;
    clockInMethod: AuthMethod;
    clockOutMethod?: AuthMethod;
    clockInPhoto?: string;
    clockOutPhoto?: string;
    status: AttendanceStatus;
    workDurationMinutes?: number;
    overtimeMinutes?: number;
    shiftCompleted: boolean;
    clockInLocation?: string;
    clockOutLocation?: string;
    notes?: string;
    isManualEntry: boolean;
    adjustedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    calculateWorkDuration(): void;
    private parseTime;
    private calculateMinutesBetween;
    get isClockedIn(): boolean;
}
