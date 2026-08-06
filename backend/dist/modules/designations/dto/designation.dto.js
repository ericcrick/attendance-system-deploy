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
exports.UpdateDesignationDto = exports.CreateDesignationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDesignationDto {
    name;
    code;
    description;
}
exports.CreateDesignationDto = CreateDesignationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Designation name',
        example: 'Security Officer',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesignationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Designation code',
        example: 'SEC-OFF',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 10),
    __metadata("design:type", String)
], CreateDesignationDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Designation description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesignationDto.prototype, "description", void 0);
class UpdateDesignationDto extends (0, swagger_1.PartialType)(CreateDesignationDto) {
    isActive;
}
exports.UpdateDesignationDto = UpdateDesignationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether designation is active',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDesignationDto.prototype, "isActive", void 0);
//# sourceMappingURL=designation.dto.js.map