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
exports.UpdateShiftDto = exports.CreateShiftDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateShiftDto {
    name;
    startTime;
    endTime;
    gracePeriodMinutes;
    description;
    colorCode;
    isActive;
}
exports.CreateShiftDto = CreateShiftDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shift name',
        example: 'Morning Shift',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shift start time in HH:MM format',
        example: '08:00',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Start time must be in HH:MM format',
    }),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shift end time in HH:MM format',
        example: '16:00',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'End time must be in HH:MM format',
    }),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grace period for late arrival in minutes',
        example: 15,
        default: 15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], CreateShiftDto.prototype, "gracePeriodMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift description',
        example: 'Standard morning shift for operations team',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift color code for UI (hex format)',
        example: '#3B82F6',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'Color code must be a valid hex color',
    }),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether shift is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateShiftDto.prototype, "isActive", void 0);
class UpdateShiftDto {
    name;
    startTime;
    endTime;
    gracePeriodMinutes;
    description;
    colorCode;
    isActive;
}
exports.UpdateShiftDto = UpdateShiftDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift name',
        example: 'Morning Shift',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift start time in HH:MM format',
        example: '08:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift end time in HH:MM format',
        example: '16:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grace period for late arrival in minutes',
        example: 15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], UpdateShiftDto.prototype, "gracePeriodMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shift color code for UI (hex format)',
        example: '#3B82F6',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether shift is active',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateShiftDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-shift.dto.js.map