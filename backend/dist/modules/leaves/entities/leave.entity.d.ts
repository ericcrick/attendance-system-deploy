import { Employee } from '../../employees/entities/employee.entity';
import { LeaveType, LeaveStatus } from '../../../common/enums';
export { LeaveType, LeaveStatus };
export declare class Leave {
    id: string;
    employeeId: string;
    employee: Employee;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    daysCount: number;
    reason: string;
    status: LeaveStatus;
    reviewedBy?: string;
    reviewComments?: string;
    reviewedAt?: Date;
    attachmentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
