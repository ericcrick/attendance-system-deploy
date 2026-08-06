import { LeaveType, LeaveStatus } from '../entities/leave.entity';
export declare class CreateLeaveDto {
    employeeId?: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
    attachmentUrl?: string;
}
declare const UpdateLeaveDto_base: import("@nestjs/common").Type<Partial<Omit<CreateLeaveDto, "employeeId">>>;
export declare class UpdateLeaveDto extends UpdateLeaveDto_base {
}
export declare class ReviewLeaveDto {
    status: LeaveStatus;
    reviewComments?: string;
}
export {};
