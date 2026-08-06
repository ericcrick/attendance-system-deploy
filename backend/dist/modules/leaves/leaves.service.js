"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LeavesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const leave_entity_1 = require("./entities/leave.entity");
const employees_service_1 = require("../employees/employees.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
function isStaff(user) {
    return roles_decorator_1.STAFF_ROLES.includes(user.role);
}
let LeavesService = LeavesService_1 = class LeavesService {
    leavesRepository;
    employeesService;
    logger = new common_1.Logger(LeavesService_1.name);
    constructor(leavesRepository, employeesService) {
        this.leavesRepository = leavesRepository;
        this.employeesService = employeesService;
    }
    deleteAttachmentFile(attachmentUrl) {
        try {
            const filename = path.basename(attachmentUrl);
            const filePath = path.join(process.cwd(), 'uploads', 'leave-attachments', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            this.logger.warn(`Failed to delete attachment file "${attachmentUrl}": ${error}`);
        }
    }
    async create(createLeaveDto, requester) {
        let targetEmployeeId = createLeaveDto.employeeId;
        if (!isStaff(requester)) {
            if (!requester.employeeId) {
                throw new common_1.BadRequestException('Your account is not linked to an employee record. Contact HR.');
            }
            const self = await this.employeesService.findOne(requester.employeeId);
            targetEmployeeId = self.employeeId;
        }
        if (!targetEmployeeId) {
            throw new common_1.BadRequestException('employeeId is required');
        }
        const employees = await this.employeesService.findAll();
        const employee = employees.find((emp) => emp.employeeId === targetEmployeeId);
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID "${targetEmployeeId}" not found`);
        }
        const startDate = new Date(createLeaveDto.startDate);
        const endDate = new Date(createLeaveDto.endDate);
        if (endDate < startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const overlapping = await this.leavesRepository
            .createQueryBuilder('leave')
            .where('leave.employeeId = :employeeId', { employeeId: employee.id })
            .andWhere('leave.status != :cancelled', {
            cancelled: leave_entity_1.LeaveStatus.CANCELLED,
        })
            .andWhere('(leave.startDate <= :endDate AND leave.endDate >= :startDate)', {
            startDate: createLeaveDto.startDate,
            endDate: createLeaveDto.endDate,
        })
            .getOne();
        if (overlapping) {
            throw new common_1.BadRequestException('Leave dates overlap with an existing leave request');
        }
        const leave = this.leavesRepository.create({
            ...createLeaveDto,
            employeeId: employee.id,
        });
        return this.leavesRepository.save(leave);
    }
    async findAll(startDate, endDate, status, employeeId, requester) {
        let effectiveEmployeeId = employeeId;
        if (requester && !isStaff(requester)) {
            if (!requester.employeeId) {
                return [];
            }
            const self = await this.employeesService.findOne(requester.employeeId);
            effectiveEmployeeId = self.employeeId;
        }
        const query = this.leavesRepository
            .createQueryBuilder('leave')
            .leftJoinAndSelect('leave.employee', 'employee')
            .leftJoinAndSelect('employee.designation', 'designation');
        if (startDate && endDate) {
            query.andWhere('leave.startDate >= :startDate', { startDate });
            query.andWhere('leave.endDate <= :endDate', { endDate });
        }
        if (status) {
            query.andWhere('leave.status = :status', { status });
        }
        if (effectiveEmployeeId) {
            query.andWhere('employee.employeeId = :employeeId', { employeeId: effectiveEmployeeId });
        }
        return query.orderBy('leave.createdAt', 'DESC').getMany();
    }
    async findOne(id, requester) {
        const leave = await this.leavesRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!leave) {
            throw new common_1.NotFoundException(`Leave with ID "${id}" not found`);
        }
        if (requester && !isStaff(requester) && leave.employeeId !== requester.employeeId) {
            throw new common_1.ForbiddenException('You do not have access to this leave request');
        }
        return leave;
    }
    async update(id, updateLeaveDto, requester) {
        const leave = await this.findOne(id, requester);
        if (leave.status !== leave_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending leaves can be updated');
        }
        const startDate = updateLeaveDto.startDate ?? leave.startDate;
        const endDate = updateLeaveDto.endDate ?? leave.endDate;
        if (updateLeaveDto.startDate || updateLeaveDto.endDate) {
            if (new Date(endDate) < new Date(startDate)) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            const overlapping = await this.leavesRepository
                .createQueryBuilder('leave')
                .where('leave.employeeId = :employeeId', { employeeId: leave.employeeId })
                .andWhere('leave.id != :id', { id })
                .andWhere('leave.status != :cancelled', {
                cancelled: leave_entity_1.LeaveStatus.CANCELLED,
            })
                .andWhere('(leave.startDate <= :endDate AND leave.endDate >= :startDate)', { startDate, endDate })
                .getOne();
            if (overlapping) {
                throw new common_1.BadRequestException('Leave dates overlap with an existing leave request');
            }
        }
        const previousAttachmentUrl = leave.attachmentUrl;
        Object.assign(leave, updateLeaveDto);
        const saved = await this.leavesRepository.save(leave);
        if (updateLeaveDto.attachmentUrl !== undefined &&
            previousAttachmentUrl &&
            previousAttachmentUrl !== updateLeaveDto.attachmentUrl) {
            this.deleteAttachmentFile(previousAttachmentUrl);
        }
        return saved;
    }
    async review(id, reviewLeaveDto, reviewerId, reviewerEmployeeId) {
        const leave = await this.findOne(id);
        if (leave.status !== leave_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending leaves can be reviewed');
        }
        if (reviewerEmployeeId && leave.employeeId === reviewerEmployeeId) {
            throw new common_1.BadRequestException('You cannot review your own leave request');
        }
        leave.status = reviewLeaveDto.status;
        leave.reviewComments = reviewLeaveDto.reviewComments;
        leave.reviewedBy = reviewerId;
        leave.reviewedAt = new Date();
        return this.leavesRepository.save(leave);
    }
    async remove(id, requester) {
        const leave = await this.findOne(id, requester);
        if (requester && !isStaff(requester) && leave.status !== leave_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending leave requests can be cancelled');
        }
        if (leave.attachmentUrl) {
            this.deleteAttachmentFile(leave.attachmentUrl);
        }
        await this.leavesRepository.remove(leave);
    }
    async getStatistics() {
        const leaves = await this.findAll();
        return {
            total: leaves.length,
            pending: leaves.filter((l) => l.status === leave_entity_1.LeaveStatus.PENDING).length,
            approved: leaves.filter((l) => l.status === leave_entity_1.LeaveStatus.APPROVED).length,
            rejected: leaves.filter((l) => l.status === leave_entity_1.LeaveStatus.REJECTED).length,
        };
    }
    async getApprovedLeaveForDate(employeeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.leavesRepository
            .createQueryBuilder('leave')
            .where('leave.employee_id = :employeeId', { employeeId })
            .andWhere('leave.status = :status', { status: leave_entity_1.LeaveStatus.APPROVED })
            .andWhere('leave.start_date <= :date', { date: endOfDay })
            .andWhere('leave.end_date >= :date', { date: startOfDay })
            .getOne();
    }
    async isEmployeeOnLeave(employeeId, date) {
        return !!(await this.getApprovedLeaveForDate(employeeId, date));
    }
    async getApprovedLeaveDaysInRange(employeeId, rangeStart, rangeEnd) {
        const leaves = await this.leavesRepository
            .createQueryBuilder('leave')
            .where('leave.employee_id = :employeeId', { employeeId })
            .andWhere('leave.status = :status', { status: leave_entity_1.LeaveStatus.APPROVED })
            .andWhere('leave.start_date <= :rangeEnd', { rangeEnd })
            .andWhere('leave.end_date >= :rangeStart', { rangeStart })
            .getMany();
        const MS_PER_DAY = 24 * 60 * 60 * 1000;
        return leaves.reduce((sum, leave) => {
            const overlapStart = Math.max(new Date(leave.startDate).getTime(), rangeStart.getTime());
            const overlapEnd = Math.min(new Date(leave.endDate).getTime(), rangeEnd.getTime());
            const overlapDays = Math.floor((overlapEnd - overlapStart) / MS_PER_DAY) + 1;
            return sum + Math.max(overlapDays, 0);
        }, 0);
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = LeavesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        employees_service_1.EmployeesService])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map