import { AttendanceService } from './attendance.service';
import { ClockInDto, ClockOutDto, VerifyEmployeeDto } from './dto/attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { LeaderboardQueryDto } from './dto/leaderboard.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    verifyEmployee(verifyDto: VerifyEmployeeDto): Promise<any>;
    clockIn(clockInDto: ClockInDto): Promise<Attendance>;
    clockOut(clockOutDto: ClockOutDto): Promise<Attendance>;
    getTodayAttendance(req: any): Promise<Attendance[]>;
    getCurrentlyPresent(req: any): Promise<Attendance[]>;
    getMyPerformance(req: any, queryDto: LeaderboardQueryDto): Promise<import("./dto/leaderboard.dto").EmployeePerformance>;
    getMyLastAttendance(req: any): Promise<Attendance | null>;
    getLeaderboard(queryDto: LeaderboardQueryDto, req: any): Promise<{
        topPerformers: import("./dto/leaderboard.dto").EmployeePerformance[];
        bottomPerformers: import("./dto/leaderboard.dto").EmployeePerformance[];
        period: {
            startDate: Date;
            endDate: Date;
        };
        statistics: any;
    }>;
    getAttendanceReport(startDate: string, endDate: string, req: any, department?: string): Promise<any>;
    getEmployeeAttendance(employeeId: string, req: any, startDate?: string, endDate?: string): Promise<Attendance[]>;
    getAttendanceById(id: string, req: any): Promise<Attendance>;
}
