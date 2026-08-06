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
exports.VerifyEmployeeDto = exports.ClockOutDto = exports.ClockInDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class ClockInDto {
    employeeId;
    method;
    rfidCardId;
    fingerprintTemplate;
    fingerprintImage;
    photoUrl;
    location;
}
exports.ClockInDto = ClockInDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', example: 'EMP-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication method', enum: enums_1.AuthMethod }),
    (0, class_validator_1.IsEnum)(enums_1.AuthMethod),
    __metadata("design:type", String)
], ClockInDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RFID card ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint template (Base64)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "fingerprintTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint image (Base64 PNG/JPEG) for SourceAFIS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "fingerprintImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Photo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockInDto.prototype, "location", void 0);
class ClockOutDto {
    employeeId;
    method;
    rfidCardId;
    fingerprintTemplate;
    fingerprintImage;
    photoUrl;
    location;
    notes;
}
exports.ClockOutDto = ClockOutDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', example: 'EMP-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication method', enum: enums_1.AuthMethod }),
    (0, class_validator_1.IsEnum)(enums_1.AuthMethod),
    __metadata("design:type", String)
], ClockOutDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RFID card ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint template (Base64)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "fingerprintTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint image (Base64 PNG/JPEG) for SourceAFIS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "fingerprintImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Photo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "notes", void 0);
class VerifyEmployeeDto {
    method;
    rfidCardId;
    employeeId;
    fingerprintTemplate;
    fingerprintImage;
}
exports.VerifyEmployeeDto = VerifyEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication method', enum: enums_1.AuthMethod }),
    (0, class_validator_1.IsEnum)(enums_1.AuthMethod),
    __metadata("design:type", String)
], VerifyEmployeeDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RFID card ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyEmployeeDto.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employee ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint template (Base64)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyEmployeeDto.prototype, "fingerprintTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fingerprint image (Base64 PNG/JPEG) for SourceAFIS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyEmployeeDto.prototype, "fingerprintImage", void 0);
//# sourceMappingURL=attendance.dto.js.map