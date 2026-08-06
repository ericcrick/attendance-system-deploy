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
exports.Leave = exports.LeaveStatus = exports.LeaveType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const employee_entity_1 = require("../../employees/entities/employee.entity");
const enums_1 = require("../../../common/enums");
Object.defineProperty(exports, "LeaveType", { enumerable: true, get: function () { return enums_1.LeaveType; } });
Object.defineProperty(exports, "LeaveStatus", { enumerable: true, get: function () { return enums_1.LeaveStatus; } });
let Leave = class Leave {
    id;
    employeeId;
    employee;
    leaveType;
    startDate;
    endDate;
    daysCount;
    reason;
    status;
    reviewedBy;
    reviewComments;
    reviewedAt;
    attachmentUrl;
    createdAt;
    updatedAt;
};
exports.Leave = Leave;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Leave.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], Leave.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee details', type: () => employee_entity_1.Employee }),
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.leaves, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Leave.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Leave type', enum: enums_1.LeaveType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.LeaveType,
        name: 'leave_type',
    }),
    __metadata("design:type", String)
], Leave.prototype, "leaveType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Leave start date' }),
    (0, typeorm_1.Column)({ type: 'date', name: 'start_date' }),
    __metadata("design:type", Date)
], Leave.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Leave end date' }),
    (0, typeorm_1.Column)({ type: 'date', name: 'end_date' }),
    __metadata("design:type", Date)
], Leave.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of days' }),
    (0, typeorm_1.Column)({ type: 'int', name: 'days_count' }),
    __metadata("design:type", Number)
], Leave.prototype, "daysCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for leave' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Leave.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Leave status', enum: enums_1.LeaveStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.LeaveStatus,
        default: enums_1.LeaveStatus.PENDING,
    }),
    __metadata("design:type", String)
], Leave.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Approver/Reviewer ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'reviewed_by' }),
    __metadata("design:type", String)
], Leave.prototype, "reviewedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review comments', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'review_comments' }),
    __metadata("design:type", String)
], Leave.prototype, "reviewComments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review date', required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'reviewed_at' }),
    __metadata("design:type", Date)
], Leave.prototype, "reviewedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supporting documents URL', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'attachment_url' }),
    __metadata("design:type", String)
], Leave.prototype, "attachmentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Leave.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Leave.prototype, "updatedAt", void 0);
exports.Leave = Leave = __decorate([
    (0, typeorm_1.Entity)('leaves')
], Leave);
//# sourceMappingURL=leave.entity.js.map