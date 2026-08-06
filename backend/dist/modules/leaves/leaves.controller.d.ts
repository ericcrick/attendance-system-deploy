import { LeavesService } from './leaves.service';
import { CreateLeaveDto, UpdateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
import { Leave, LeaveStatus } from './entities/leave.entity';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    create(createLeaveDto: CreateLeaveDto, req: any): Promise<Leave>;
    uploadAttachment(file: Express.Multer.File): {
        url: string;
    };
    findAll(req: any, startDate?: string, endDate?: string, status?: LeaveStatus, employeeId?: string): Promise<Leave[]>;
    getStatistics(): Promise<any>;
    findOne(id: string, req: any): Promise<Leave>;
    update(id: string, updateLeaveDto: UpdateLeaveDto, req: any): Promise<Leave>;
    review(id: string, reviewLeaveDto: ReviewLeaveDto, req: any): Promise<Leave>;
    remove(id: string, req: any): Promise<void>;
}
