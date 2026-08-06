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
exports.Shift = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const employee_entity_1 = require("../../employees/entities/employee.entity");
let Shift = class Shift {
    id;
    name;
    startTime;
    endTime;
    gracePeriodMinutes;
    description;
    colorCode;
    isActive;
    employees;
    createdAt;
    updatedAt;
    isWithinShift(time = new Date()) {
        const currentTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        return currentTime >= this.startTime && currentTime <= this.endTime;
    }
    isLateArrival(arrivalTime) {
        const [shiftHour, shiftMinute] = this.startTime.split(':').map(Number);
        const shiftStart = new Date(arrivalTime);
        shiftStart.setHours(shiftHour, shiftMinute, 0, 0);
        const graceEnd = new Date(shiftStart.getTime() + this.gracePeriodMinutes * 60000);
        return arrivalTime > graceEnd;
    }
};
exports.Shift = Shift;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Shift.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift name', example: 'Morning Shift' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Shift.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift start time', example: '08:00' }),
    (0, typeorm_1.Column)({ name: 'start_time' }),
    __metadata("design:type", String)
], Shift.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift end time', example: '16:00' }),
    (0, typeorm_1.Column)({ name: 'end_time' }),
    __metadata("design:type", String)
], Shift.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grace period for late arrival in minutes', example: 15 }),
    (0, typeorm_1.Column)({ name: 'grace_period_minutes', default: 15 }),
    __metadata("design:type", Number)
], Shift.prototype, "gracePeriodMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift description', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift color code for UI', example: '#3B82F6', required: false }),
    (0, typeorm_1.Column)({ name: 'color_code', nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether shift is active', default: true }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Shift.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employees assigned to this shift', type: () => [employee_entity_1.Employee] }),
    (0, typeorm_1.OneToMany)(() => employee_entity_1.Employee, (employee) => employee.shift),
    __metadata("design:type", Array)
], Shift.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Shift.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Shift.prototype, "updatedAt", void 0);
exports.Shift = Shift = __decorate([
    (0, typeorm_1.Entity)('shifts')
], Shift);
//# sourceMappingURL=shift.entity.js.map