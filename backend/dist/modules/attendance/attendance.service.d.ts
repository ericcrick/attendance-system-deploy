import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClockInDto, ClockOutDto, VerifyEmployeeDto } from './dto/attendance.dto';
import { EmployeesService } from '../employees/employees.service';
import { UserRole } from '../../common/enums';
import { LeavesService } from '../leaves/leaves.service';
import { EmployeePerformance, LeaderboardQueryDto } from './dto/leaderboard.dto';
export interface RequestingUser {
    id: string;
    role: UserRole;
    employeeId?: string;
}
export declare class AttendanceService {
    private readonly attendanceRepository;
    private readonly employeesService;
    private readonly leavesService;
    private readonly logger;
    constructor(attendanceRepository: Repository<Attendance>, employeesService: EmployeesService, leavesService: LeavesService);
    clockIn(clockInDto: ClockInDto): Promise<Attendance>;
    clockOut(clockOutDto: ClockOutDto): Promise<Attendance>;
    private resolveScopedDepartment;
    getTodayAttendance(requester?: RequestingUser): Promise<Attendance[]>;
    getEmployeeAttendance(employeeId: string, startDate?: Date, endDate?: Date, requester?: RequestingUser): Promise<Attendance[]>;
    getAttendanceById(id: string, requester?: RequestingUser): Promise<Attendance>;
    getAttendanceReport(startDate: Date, endDate: Date, department?: string, requester?: RequestingUser): Promise<any>;
    getCurrentlyPresent(requester?: RequestingUser): Promise<Attendance[]>;
    getMyPerformance(employeeId: string | undefined, queryDto: LeaderboardQueryDto): Promise<EmployeePerformance>;
    getMyLastAttendance(employeeId: string | undefined): Promise<Attendance | null>;
    getLeaderboard(queryDto: LeaderboardQueryDto, requester?: RequestingUser): Promise<{
        topPerformers: EmployeePerformance[];
        bottomPerformers: EmployeePerformance[];
        period: {
            startDate: Date;
            endDate: Date;
        };
        statistics: any;
    }>;
    private formatLeaveBlockMessage;
    private calculateWorkingDays;
    private calculateDateRange;
    private calculateEmployeePerformance;
    private calculatePerformanceScore;
    private calculateOverallStatistics;
    verifyEmployee(verifyDto: VerifyEmployeeDto): Promise<any>;
}
