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
exports.UpdateDepartmentDto = exports.CreateDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDepartmentDto {
    name;
    code;
    description;
    managerName;
    managerEmail;
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Department name',
        example: 'Security',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Department code',
        example: 'SEC',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 10),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manager name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "managerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manager email',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "managerEmail", void 0);
class UpdateDepartmentDto extends (0, swagger_1.PartialType)(CreateDepartmentDto) {
    isActive;
}
exports.UpdateDepartmentDto = UpdateDepartmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether department is active',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDepartmentDto.prototype, "isActive", void 0);
//# sourceMappingURL=department.dto.js.map