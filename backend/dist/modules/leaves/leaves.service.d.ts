import { Repository } from 'typeorm';
import { Leave, LeaveStatus } from './entities/leave.entity';
import { CreateLeaveDto, UpdateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
import { EmployeesService } from '../employees/employees.service';
import { UserRole } from '../../common/enums';
export interface RequestingUser {
    id: string;
    role: UserRole;
    employeeId?: string;
}
export declare class LeavesService {
    private readonly leavesRepository;
    private readonly employeesService;
    private readonly logger;
    constructor(leavesRepository: Repository<Leave>, employeesService: EmployeesService);
    private deleteAttachmentFile;
    create(createLeaveDto: CreateLeaveDto, requester: RequestingUser): Promise<Leave>;
    findAll(startDate?: string, endDate?: string, status?: LeaveStatus, employeeId?: string, requester?: RequestingUser): Promise<Leave[]>;
    findOne(id: string, requester?: RequestingUser): Promise<Leave>;
    update(id: string, updateLeaveDto: UpdateLeaveDto, requester?: RequestingUser): Promise<Leave>;
    review(id: string, reviewLeaveDto: ReviewLeaveDto, reviewerId: string, reviewerEmployeeId?: string): Promise<Leave>;
    remove(id: string, requester?: RequestingUser): Promise<void>;
    getStatistics(): Promise<any>;
    getApprovedLeaveForDate(employeeId: string, date: Date): Promise<Leave | null>;
    isEmployeeOnLeave(employeeId: string, date: Date): Promise<boolean>;
    getApprovedLeaveDaysInRange(employeeId: string, rangeStart: Date, rangeEnd: Date): Promise<number>;
}
