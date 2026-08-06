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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const employee_entity_1 = require("../../employees/entities/employee.entity");
let Attendance = class Attendance {
    id;
    employeeId;
    employee;
    clockInTime;
    clockOutTime;
    clockInMethod;
    clockOutMethod;
    clockInPhoto;
    clockOutPhoto;
    status;
    workDurationMinutes;
    overtimeMinutes;
    shiftCompleted;
    clockInLocation;
    clockOutLocation;
    notes;
    isManualEntry;
    adjustedBy;
    createdAt;
    updatedAt;
    calculateWorkDuration() {
        if (this.clockInTime && this.clockOutTime && this.employee?.shift) {
            const diffMs = this.clockOutTime.getTime() - this.clockInTime.getTime();
            this.workDurationMinutes = Math.floor(diffMs / 60000);
            const shiftStart = this.parseTime(this.employee.shift.startTime);
            const shiftEnd = this.parseTime(this.employee.shift.endTime);
            const expectedMinutes = this.calculateMinutesBetween(shiftStart, shiftEnd);
            this.overtimeMinutes = Math.max(0, this.workDurationMinutes - expectedMinutes);
            const completionThreshold = expectedMinutes * 0.9;
            this.shiftCompleted = this.workDurationMinutes >= completionThreshold;
            if (this.overtimeMinutes > 30) {
                this.status = enums_1.AttendanceStatus.OVERTIME;
            }
            else if (this.shiftCompleted) {
                this.status = enums_1.AttendanceStatus.COMPLETED;
            }
            else {
                this.status = enums_1.AttendanceStatus.EARLY_DEPARTURE;
            }
        }
    }
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return { hours, minutes };
    }
    calculateMinutesBetween(start, end) {
        const startMinutes = start.hours * 60 + start.minutes;
        let endMinutes = end.hours * 60 + end.minutes;
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }
        return endMinutes - startMinutes;
    }
    get isClockedIn() {
        return !this.clockOutTime;
    }
};
exports.Attendance = Attendance;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], Attendance.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee details', type: () => employee_entity_1.Employee }),
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.attendances, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Attendance.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock in timestamp' }),
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'clock_in_time' }),
    __metadata("design:type", Date)
], Attendance.prototype, "clockInTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock out timestamp', required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'clock_out_time' }),
    __metadata("design:type", Date)
], Attendance.prototype, "clockOutTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication method used for clock in' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.AuthMethod,
        name: 'clock_in_method',
    }),
    __metadata("design:type", String)
], Attendance.prototype, "clockInMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication method used for clock out', required: false }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.AuthMethod,
        nullable: true,
        name: 'clock_out_method',
    }),
    __metadata("design:type", String)
], Attendance.prototype, "clockOutMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock in photo URL', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'clock_in_photo' }),
    __metadata("design:type", String)
], Attendance.prototype, "clockInPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock out photo URL', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'clock_out_photo' }),
    __metadata("design:type", String)
], Attendance.prototype, "clockOutPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attendance status' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.AttendanceStatus,
        default: enums_1.AttendanceStatus.ON_TIME,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total work duration in minutes', required: false }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'work_duration_minutes' }),
    __metadata("design:type", Number)
], Attendance.prototype, "workDurationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overtime duration in minutes', required: false }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0, name: 'overtime_minutes' }),
    __metadata("design:type", Number)
], Attendance.prototype, "overtimeMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether shift was completed', default: false }),
    (0, typeorm_1.Column)({ default: false, name: 'shift_completed' }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "shiftCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock in location', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'clock_in_location' }),
    __metadata("design:type", String)
], Attendance.prototype, "clockInLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clock out location', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'clock_out_location' }),
    __metadata("design:type", String)
], Attendance.prototype, "clockOutLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manual entry flag', default: false }),
    (0, typeorm_1.Column)({ default: false, name: 'is_manual_entry' }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "isManualEntry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admin who adjusted', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'adjusted_by' }),
    __metadata("design:type", String)
], Attendance.prototype, "adjustedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendances')
], Attendance);
//# sourceMappingURL=attendance.entity.js.map