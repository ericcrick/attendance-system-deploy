export declare enum TimePeriod {
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
    CUSTOM = "CUSTOM"
}
export declare class LeaderboardQueryDto {
    period?: TimePeriod;
    startDate?: string;
    endDate?: string;
    department?: string;
}
export interface EmployeePerformance {
    employeeId: string;
    employeeName: string;
    department: string;
    position: string;
    photoUrl?: string;
    totalDays: number;
    attendedDays: number;
    absentDays: number;
    leaveDays: number;
    lateDays: number;
    onTimeDays: number;
    overtimeHours: number;
    completedShifts: number;
    incompleteShifts: number;
    attendanceRate: number;
    onTimeRate: number;
    completionRate: number;
    averageWorkHours: number;
    totalWorkMinutes: number;
    score: number;
    rank: number;
    trend: 'up' | 'down' | 'stable';
}
