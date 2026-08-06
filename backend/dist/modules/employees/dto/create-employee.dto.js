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
exports.AssignFingerprintDto = exports.AssignRfidDto = exports.UpdateEmployeeDto = exports.CreateEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class CreateEmployeeDto {
    employeeId;
    firstName;
    lastName;
    middleName;
    email;
    phone;
    department;
    departmentId;
    status;
    position;
    designationId;
    postingId;
    yearOfEnlistment;
    rfidCardId;
    shiftId;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', example: 'EMP-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Middle name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.EmploymentStatus),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Position/Job title (legacy free-text field)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Designation ID (UUID)' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting ID (UUID)' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "postingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Year of enlistment', example: 2015 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1950),
    (0, class_validator_1.Max)(new Date().getFullYear()),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "yearOfEnlistment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RFID card ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "shiftId", void 0);
class UpdateEmployeeDto {
    firstName;
    lastName;
    middleName;
    email;
    phone;
    department;
    departmentId;
    position;
    designationId;
    postingId;
    yearOfEnlistment;
    rfidCardId;
    shiftId;
    status;
    notes;
    disabledAuthMethods;
}
exports.UpdateEmployeeDto = UpdateEmployeeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'First name', example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last name', example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Middle name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Job position (legacy free-text field)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Designation ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Posting ID (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "postingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Year of enlistment', example: 2015 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1950),
    (0, class_validator_1.Max)(new Date().getFullYear()),
    __metadata("design:type", Number)
], UpdateEmployeeDto.prototype, "yearOfEnlistment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'RFID card identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned shift ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "shiftId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employment status', enum: enums_1.EmploymentStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.EmploymentStatus),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auth methods to disable for clock-in/out on this employee, even if a credential is enrolled',
        enum: enums_1.AuthMethod,
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(enums_1.AuthMethod, { each: true }),
    __metadata("design:type", Array)
], UpdateEmployeeDto.prototype, "disabledAuthMethods", void 0);
class AssignRfidDto {
    rfidCardId;
}
exports.AssignRfidDto = AssignRfidDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'RFID card identifier', example: 'RFID-12345' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], AssignRfidDto.prototype, "rfidCardId", void 0);
class AssignFingerprintDto {
    fingerprintTemplate;
    fingerprintImage;
    fingerprintDeviceId;
}
exports.AssignFingerprintDto = AssignFingerprintDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fingerprint template data (Base64 encoded string from DigitalPersona)',
        example: 'AAAAAAAAAAAAA...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignFingerprintDto.prototype, "fingerprintTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw fingerprint image (Base64 encoded PNG)',
        example: 'iVBORw0KGgo...',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignFingerprintDto.prototype, "fingerprintImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device user ID for synchronization',
        example: '1001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignFingerprintDto.prototype, "fingerprintDeviceId", void 0);
//# sourceMappingURL=create-employee.dto.js.map