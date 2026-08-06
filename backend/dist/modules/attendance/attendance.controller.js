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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const attendance_service_1 = require("./attendance.service");
const attendance_dto_1 = require("./dto/attendance.dto");
const attendance_entity_1 = require("./entities/attendance.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const leaderboard_dto_1 = require("./dto/leaderboard.dto");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    verifyEmployee(verifyDto) {
        return this.attendanceService.verifyEmployee(verifyDto);
    }
    clockIn(clockInDto) {
        return this.attendanceService.clockIn(clockInDto);
    }
    clockOut(clockOutDto) {
        return this.attendanceService.clockOut(clockOutDto);
    }
    getTodayAttendance(req) {
        return this.attendanceService.getTodayAttendance(req.user);
    }
    getCurrentlyPresent(req) {
        return this.attendanceService.getCurrentlyPresent(req.user);
    }
    async getMyPerformance(req, queryDto) {
        return this.attendanceService.getMyPerformance(req.user.employeeId, queryDto);
    }
    async getMyLastAttendance(req) {
        return this.attendanceService.getMyLastAttendance(req.user.employeeId);
    }
    async getLeaderboard(queryDto, req) {
        return this.attendanceService.getLeaderboard(queryDto, req.user);
    }
    getAttendanceReport(startDate, endDate, req, department) {
        return this.attendanceService.getAttendanceReport(new Date(startDate), new Date(endDate), department, req.user);
    }
    getEmployeeAttendance(employeeId, req, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getEmployeeAttendance(employeeId, start, end, req.user);
    }
    getAttendanceById(id, req) {
        return this.attendanceService.getAttendanceById(id, req.user);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify employee identity using RFID, PIN, or Fingerprint',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee verified successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication failed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid verification data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.VerifyEmployeeDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "verifyEmployee", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('clock-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Clock in an employee' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Clocked in successfully',
        type: attendance_entity_1.Attendance,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Already clocked in or invalid data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.ClockInDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockIn", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('clock-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Clock out an employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clocked out successfully',
        type: attendance_entity_1.Attendance,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No active clock-in found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.ClockOutDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockOut", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({ summary: "Get all attendance records for today (Supervisors: their department only)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Today\'s attendance records',
        type: [attendance_entity_1.Attendance],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTodayAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('currently-present'),
    (0, swagger_1.ApiOperation)({ summary: "Get all employees currently present (Supervisors: their department only)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Currently present employees',
        type: [attendance_entity_1.Attendance],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getCurrentlyPresent", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('me/performance'),
    (0, swagger_1.ApiOperation)({ summary: "Get the logged-in user's own attendance performance" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Own performance metrics for the period' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Account not linked to an employee record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, leaderboard_dto_1.LeaderboardQueryDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyPerformance", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('me/last'),
    (0, swagger_1.ApiOperation)({ summary: "Get the logged-in user's own most recent attendance record" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Most recent attendance record, or null if none exist' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Account not linked to an employee record' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyLastAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance leaderboard' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leaderboard data retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leaderboard_dto_1.LeaderboardQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getLeaderboard", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('report'),
    (0, swagger_1.ApiOperation)({ summary: "Get attendance report with statistics (Supervisors: their department only)" }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'department', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Attendance report',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Query)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceReport", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('employee/:employeeId'),
    (0, swagger_1.ApiOperation)({ summary: "Get attendance records for a specific employee (Supervisors: their department only)" }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee attendance records',
        type: [attendance_entity_1.Attendance],
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Employee is outside your department' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getEmployeeAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Attendance record details',
        type: attendance_entity_1.Attendance,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Record is outside your department' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceById", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('attendance'),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map