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
exports.ReviewLeaveDto = exports.UpdateLeaveDto = exports.CreateLeaveDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const leave_entity_1 = require("../entities/leave.entity");
class CreateLeaveDto {
    employeeId;
    leaveType;
    startDate;
    endDate;
    daysCount;
    reason;
    attachmentUrl;
}
exports.CreateLeaveDto = CreateLeaveDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Employee ID — required for staff filing on someone else\'s behalf; ignored (and derived from the caller instead) for self-service requests',
        example: 'EMP-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Leave type',
        enum: leave_entity_1.LeaveType,
        example: leave_entity_1.LeaveType.ANNUAL,
    }),
    (0, class_validator_1.IsEnum)(leave_entity_1.LeaveType),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "leaveType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date (YYYY-MM-DD)',
        example: '2025-10-20',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date (YYYY-MM-DD)',
        example: '2025-10-25',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of leave days',
        example: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLeaveDto.prototype, "daysCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for leave',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attachment URL',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "attachmentUrl", void 0);
class UpdateLeaveDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(CreateLeaveDto, ['employeeId'])) {
}
exports.UpdateLeaveDto = UpdateLeaveDto;
class ReviewLeaveDto {
    status;
    reviewComments;
}
exports.ReviewLeaveDto = ReviewLeaveDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Leave status',
        enum: leave_entity_1.LeaveStatus,
        example: leave_entity_1.LeaveStatus.APPROVED,
    }),
    (0, class_validator_1.IsEnum)(leave_entity_1.LeaveStatus),
    __metadata("design:type", String)
], ReviewLeaveDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Review comments',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewLeaveDto.prototype, "reviewComments", void 0);
//# sourceMappingURL=leave.dto.js.map