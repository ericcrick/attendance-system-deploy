"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const employees_service_1 = require("../employees/employees.service");
const enums_1 = require("../../common/enums");
const leaves_service_1 = require("../leaves/leaves.service");
const leaderboard_dto_1 = require("./dto/leaderboard.dto");
let AttendanceService = AttendanceService_1 = class AttendanceService {
    attendanceRepository;
    employeesService;
    leavesService;
    logger = new common_1.Logger(AttendanceService_1.name);
    constructor(attendanceRepository, employeesService, leavesService) {
        this.attendanceRepository = attendanceRepository;
        this.employeesService = employeesService;
        this.leavesService = leavesService;
    }
    async clockIn(clockInDto) {
        const verifyDto = {
            method: clockInDto.method,
            rfidCardId: clockInDto.rfidCardId,
            employeeId: clockInDto.employeeId,
            fingerprintTemplate: clockInDto.fingerprintTemplate,
            fingerprintImage: clockInDto.fingerprintImage
        };
        const { employee } = await this.verifyEmployee(verifyDto);
        const today = new Date();
        const activeLeave = await this.leavesService.getApprovedLeaveForDate(employee.id, today);
        if (activeLeave) {
            throw new common_1.BadRequestException(this.formatLeaveBlockMessage(activeLeave, 'clock in'));
        }
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayAttendance = await this.attendanceRepository.findOne({
            where: {
                employeeId: employee.id,
                clockInTime: (0, typeorm_2.Between)(today, tomorrow),
            },
            order: {
                clockInTime: 'DESC',
            },
        });
        if (todayAttendance) {
            if (!todayAttendance.clockOutTime) {
                throw new common_1.BadRequestException('You have already clocked in today and have not clocked out yet. Please clock out before clocking in again.');
            }
            else {
                throw new common_1.BadRequestException('You have already completed your attendance for today. You clocked in and out successfully.');
            }
        }
        const fullEmployee = await this.employeesService.findOne(employee.id);
        const clockInTime = new Date();
        const status = fullEmployee.shift.isLateArrival(clockInTime)
            ? enums_1.AttendanceStatus.LATE
            : enums_1.AttendanceStatus.ON_TIME;
        const attendance = this.attendanceRepository.create({
            employeeId: employee.id,
            clockInTime,
            clockInMethod: clockInDto.method,
            clockInPhoto: clockInDto.photoUrl,
            clockInLocation: clockInDto.location,
            status,
            shiftCompleted: false,
            overtimeMinutes: 0,
        });
        return this.attendanceRepository.save(attendance);
    }
    async clockOut(clockOutDto) {
        const verifyDto = {
            method: clockOutDto.method,
            rfidCardId: clockOutDto.rfidCardId,
            employeeId: clockOutDto.employeeId,
            fingerprintTemplate: clockOutDto.fingerprintTemplate,
            fingerprintImage: clockOutDto.fingerprintImage
        };
        const { employee } = await this.verifyEmployee(verifyDto);
        const today = new Date();
        const activeLeave = await this.leavesService.getApprovedLeaveForDate(employee.id, today);
        if (activeLeave) {
            throw new common_1.BadRequestException(this.formatLeaveBlockMessage(activeLeave, 'clock out'));
        }
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const completedAttendance = await this.attendanceRepository.findOne({
            where: {
                employeeId: employee.id,
                clockInTime: (0, typeorm_2.Between)(today, tomorrow),
            },
            order: {
                clockInTime: 'DESC',
            },
        });
        if (completedAttendance && completedAttendance.clockOutTime) {
            const clockOutTimeFormatted = completedAttendance.clockOutTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            throw new common_1.BadRequestException(`You have already clocked out today at ${clockOutTimeFormatted}. You cannot clock out again.`);
        }
        const attendance = await this.attendanceRepository.findOne({
            where: {
                employeeId: employee.id,
                clockInTime: (0, typeorm_2.Between)(today, tomorrow),
                clockOutTime: null,
            },
        });
        if (!attendance) {
            throw new common_1.BadRequestException('No active clock-in record found for today. Please clock in first before clocking out.');
        }
        attendance.clockOutTime = new Date();
        attendance.clockOutMethod = clockOutDto.method;
        attendance.clockOutPhoto = clockOutDto.photoUrl;
        attendance.clockOutLocation = clockOutDto.location;
        attendance.notes = clockOutDto.notes;
        attendance.calculateWorkDuration();
        return this.attendanceRepository.save(attendance);
    }
    async resolveScopedDepartment(requester) {
        if (!requester || requester.role !== enums_1.UserRole.SUPERVISOR) {
            return undefined;
        }
        if (!requester.employeeId) {
            throw new common_1.ForbiddenException('Your account is not linked to an employee record. Contact HR to get linked.');
        }
        const employee = await this.employeesService.findOne(requester.employeeId);
        return employee.department;
    }
    async getTodayAttendance(requester) {
        const department = await this.resolveScopedDepartment(requester);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const query = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .where('attendance.clockInTime BETWEEN :today AND :tomorrow', { today, tomorrow });
        if (department) {
            query.andWhere('employee.department = :department', { department });
        }
        return query.orderBy('attendance.clockInTime', 'DESC').getMany();
    }
    async getEmployeeAttendance(employeeId, startDate, endDate, requester) {
        const department = await this.resolveScopedDepartment(requester);
        if (department) {
            const targetEmployee = await this.employeesService.findOne(employeeId);
            if (targetEmployee.department !== department) {
                throw new common_1.ForbiddenException('This employee is outside your department');
            }
        }
        const query = {
            employeeId,
        };
        if (startDate && endDate) {
            query.clockInTime = (0, typeorm_2.Between)(startDate, endDate);
        }
        return this.attendanceRepository.find({
            where: query,
            order: {
                clockInTime: 'DESC',
            },
        });
    }
    async getAttendanceById(id, requester) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record with ID "${id}" not found`);
        }
        const department = await this.resolveScopedDepartment(requester);
        if (department && attendance.employee?.department !== department) {
            throw new common_1.ForbiddenException('This attendance record is outside your department');
        }
        return attendance;
    }
    async getAttendanceReport(startDate, endDate, department, requester) {
        const scopedDepartment = await this.resolveScopedDepartment(requester);
        const effectiveDepartment = scopedDepartment ?? department;
        let query = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .where('attendance.clockInTime BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        });
        if (effectiveDepartment) {
            query = query.andWhere('employee.department = :department', {
                department: effectiveDepartment,
            });
        }
        const attendances = await query
            .orderBy('attendance.clockInTime', 'DESC')
            .getMany();
        const totalRecords = attendances.length;
        const onTime = attendances.filter((a) => a.status === enums_1.AttendanceStatus.ON_TIME).length;
        const late = attendances.filter((a) => a.status === enums_1.AttendanceStatus.LATE).length;
        const earlyDeparture = attendances.filter((a) => a.status === enums_1.AttendanceStatus.EARLY_DEPARTURE).length;
        return {
            attendances,
            statistics: {
                totalRecords,
                onTime,
                late,
                earlyDeparture,
                onTimePercentage: totalRecords > 0 ? (onTime / totalRecords) * 100 : 0,
            },
        };
    }
    async getCurrentlyPresent(requester) {
        const department = await this.resolveScopedDepartment(requester);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const query = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .where('attendance.clockInTime BETWEEN :today AND :tomorrow', { today, tomorrow })
            .andWhere('attendance.clockOutTime IS NULL');
        if (department) {
            query.andWhere('employee.department = :department', { department });
        }
        return query.orderBy('attendance.clockInTime', 'DESC').getMany();
    }
    async getMyPerformance(employeeId, queryDto) {
        if (!employeeId) {
            throw new common_1.NotFoundException('Your account is not linked to an employee record. Contact HR to get linked.');
        }
        const employee = await this.employeesService.findOne(employeeId);
        const { startDate, endDate } = this.calculateDateRange(queryDto);
        return this.calculateEmployeePerformance(employee, startDate, endDate);
    }
    async getMyLastAttendance(employeeId) {
        if (!employeeId) {
            throw new common_1.NotFoundException('Your account is not linked to an employee record. Contact HR to get linked.');
        }
        return this.attendanceRepository.findOne({
            where: { employeeId },
            order: { clockInTime: 'DESC' },
        });
    }
    async getLeaderboard(queryDto, requester) {
        const { startDate, endDate } = this.calculateDateRange(queryDto);
        const scopedDepartment = await this.resolveScopedDepartment(requester);
        let employees = await this.employeesService.findAll(false);
        if (scopedDepartment) {
            employees = employees.filter((e) => e.department === scopedDepartment);
        }
        const performances = await Promise.all(employees.map((employee) => this.calculateEmployeePerformance(employee, startDate, endDate)));
        const validPerformances = performances.filter((p) => p.totalDays > 0);
        validPerformances.sort((a, b) => b.score - a.score);
        validPerformances.forEach((perf, index) => {
            perf.rank = index + 1;
        });
        const topPerformers = validPerformances.slice(0, 10);
        const bottomPerformers = validPerformances
            .slice(-10)
            .reverse();
        const statistics = this.calculateOverallStatistics(validPerformances);
        return {
            topPerformers,
            bottomPerformers,
            period: { startDate, endDate },
            statistics,
        };
    }
    formatLeaveBlockMessage(leave, action) {
        const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const typeLabel = leave.leaveType.charAt(0) + leave.leaveType.slice(1).toLowerCase();
        return `You cannot ${action} today because you have an approved ${typeLabel} leave request covering ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)}. Please contact HR if this is incorrect.`;
    }
    calculateWorkingDays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);
        while (current <= endDate) {
            count++;
            current.setDate(current.getDate() + 1);
        }
        return count;
    }
    calculateDateRange(queryDto) {
        const now = new Date();
        let startDate;
        let endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        if (queryDto.period === leaderboard_dto_1.TimePeriod.CUSTOM && queryDto.startDate && queryDto.endDate) {
            startDate = new Date(queryDto.startDate);
            endDate = new Date(queryDto.endDate);
            endDate.setHours(23, 59, 59, 999);
        }
        else {
            switch (queryDto.period) {
                case leaderboard_dto_1.TimePeriod.WEEKLY:
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case leaderboard_dto_1.TimePeriod.MONTHLY:
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 30);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case leaderboard_dto_1.TimePeriod.YEARLY:
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 365);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                default:
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 30);
                    startDate.setHours(0, 0, 0, 0);
            }
        }
        return { startDate, endDate };
    }
    async calculateEmployeePerformance(employee, startDate, endDate) {
        const attendances = await this.attendanceRepository.find({
            where: {
                employeeId: employee.id,
                clockInTime: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: {
                clockInTime: 'DESC',
            },
        });
        const totalDays = this.calculateWorkingDays(startDate, endDate);
        const attendedDays = attendances.length;
        const leaveDays = await this.leavesService.getApprovedLeaveDaysInRange(employee.id, startDate, endDate);
        const absentDays = Math.max(totalDays - attendedDays - leaveDays, 0);
        const lateDays = attendances.filter((a) => a.status === enums_1.AttendanceStatus.LATE).length;
        const onTimeDays = attendances.filter((a) => a.status === enums_1.AttendanceStatus.ON_TIME).length;
        const completedShifts = attendances.filter((a) => a.shiftCompleted).length;
        const incompleteShifts = attendances.filter((a) => !a.clockOutTime || !a.shiftCompleted).length;
        const totalOvertimeMinutes = attendances.reduce((sum, a) => sum + (a.overtimeMinutes || 0), 0);
        const totalWorkMinutes = attendances.reduce((sum, a) => sum + (a.workDurationMinutes || 0), 0);
        const expectedDays = Math.max(totalDays - leaveDays, 0);
        const attendanceRate = expectedDays > 0 ? Math.min((attendedDays / expectedDays) * 100, 100) : 0;
        const onTimeRate = attendedDays > 0 ? (onTimeDays / attendedDays) * 100 : 0;
        const completionRate = attendedDays > 0 ? (completedShifts / attendedDays) * 100 : 0;
        const averageWorkHours = attendedDays > 0 ? totalWorkMinutes / 60 / attendedDays : 0;
        const score = this.calculatePerformanceScore({
            attendanceRate,
            onTimeRate,
            completionRate,
            overtimeHours: totalOvertimeMinutes / 60,
        });
        return {
            employeeId: employee.employeeId,
            employeeName: employee.fullName,
            department: employee.department,
            position: employee.position,
            photoUrl: employee.photoUrl,
            totalDays,
            attendedDays,
            absentDays,
            leaveDays,
            lateDays,
            onTimeDays,
            overtimeHours: Math.round((totalOvertimeMinutes / 60) * 10) / 10,
            completedShifts,
            incompleteShifts,
            attendanceRate: Math.round(attendanceRate * 10) / 10,
            onTimeRate: Math.round(onTimeRate * 10) / 10,
            completionRate: Math.round(completionRate * 10) / 10,
            averageWorkHours: Math.round(averageWorkHours * 10) / 10,
            totalWorkMinutes,
            score: Math.round(score * 10) / 10,
            rank: 0,
            trend: 'stable',
        };
    }
    calculatePerformanceScore(metrics) {
        const weights = {
            attendance: 0.4,
            onTime: 0.3,
            completion: 0.25,
            overtime: 0.05,
        };
        let score = 0;
        score += metrics.attendanceRate * weights.attendance;
        score += metrics.onTimeRate * weights.onTime;
        score += metrics.completionRate * weights.completion;
        const overtimeBonus = Math.min(metrics.overtimeHours * 0.5, 5);
        score += overtimeBonus * weights.overtime * 100;
        return Math.min(score, 100);
    }
    calculateOverallStatistics(performances) {
        if (performances.length === 0) {
            return {
                averageAttendanceRate: 0,
                averageOnTimeRate: 0,
                averageCompletionRate: 0,
                totalEmployees: 0,
                excellentPerformers: 0,
                goodPerformers: 0,
                poorPerformers: 0,
            };
        }
        const avgAttendance = performances.reduce((sum, p) => sum + p.attendanceRate, 0) /
            performances.length;
        const avgOnTime = performances.reduce((sum, p) => sum + p.onTimeRate, 0) /
            performances.length;
        const avgCompletion = performances.reduce((sum, p) => sum + p.completionRate, 0) /
            performances.length;
        const excellent = performances.filter((p) => p.score >= 90).length;
        const good = performances.filter((p) => p.score >= 70 && p.score < 90).length;
        const poor = performances.filter((p) => p.score < 70).length;
        return {
            averageAttendanceRate: Math.round(avgAttendance * 10) / 10,
            averageOnTimeRate: Math.round(avgOnTime * 10) / 10,
            averageCompletionRate: Math.round(avgCompletion * 10) / 10,
            totalEmployees: performances.length,
            excellentPerformers: excellent,
            goodPerformers: good,
            poorPerformers: poor,
        };
    }
    async verifyEmployee(verifyDto) {
        let employee = null;
        switch (verifyDto.method) {
            case enums_1.AuthMethod.RFID:
                if (!verifyDto.rfidCardId) {
                    throw new common_1.BadRequestException('RFID card ID is required');
                }
                employee = await this.employeesService.findByRfidCard(verifyDto.rfidCardId);
                if (!employee) {
                    throw new common_1.UnauthorizedException('RFID card not recognized');
                }
                break;
            case enums_1.AuthMethod.FINGERPRINT:
                if (verifyDto.fingerprintImage) {
                    this.logger.log(`🔐 Attempting fingerprint verification with SourceAFIS (image length: ${verifyDto.fingerprintImage.length})`);
                    employee = await this.employeesService.verifyFingerprintFromImage(verifyDto.fingerprintImage);
                    if (employee) {
                        this.logger.log(`✅ Fingerprint verified via SourceAFIS: ${employee.fullName} (${employee.employeeId})`);
                        break;
                    }
                }
                if (verifyDto.fingerprintTemplate) {
                    this.logger.log(`🔐 Falling back to template-based verification (template length: ${verifyDto.fingerprintTemplate.length})`);
                    employee = await this.employeesService.verifyFingerprint(verifyDto.fingerprintTemplate);
                }
                if (!employee) {
                    this.logger.warn('❌ Fingerprint verification failed - no match found');
                    throw new common_1.UnauthorizedException('Fingerprint not recognized. Please try again or use an alternate method.');
                }
                this.logger.log(`✅ Fingerprint verified: ${employee.fullName} (${employee.employeeId})`);
                break;
            default:
                throw new common_1.BadRequestException('Invalid authentication method');
        }
        if (employee.disabledAuthMethods?.includes(verifyDto.method)) {
            throw new common_1.UnauthorizedException(`${verifyDto.method === enums_1.AuthMethod.RFID ? 'RFID' : 'Fingerprint'} clock-in/out has been disabled for this employee. Please use an alternate method.`);
        }
        if (employee.status !== enums_1.EmploymentStatus.ACTIVE) {
            throw new common_1.UnauthorizedException(`Employee account is ${employee.status.toLowerCase()}. Please contact HR.`);
        }
        return {
            employee: {
                id: employee.id,
                employeeId: employee.employeeId,
                fullName: employee.fullName,
                department: employee.department,
                position: employee.position,
                shift: employee.shift,
            },
            verified: true,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        employees_service_1.EmployeesService,
        leaves_service_1.LeavesService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map