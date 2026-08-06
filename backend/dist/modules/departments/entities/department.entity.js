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
exports.Department = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Department = class Department {
    id;
    name;
    code;
    description;
    managerName;
    managerEmail;
    isActive;
    createdAt;
    updatedAt;
    employeeCount;
};
exports.Department = Department;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Department.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name', example: 'Security' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department code', example: 'SEC' }),
    (0, typeorm_1.Column)({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Department.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department description', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Department.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department head/manager name', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'manager_name' }),
    __metadata("design:type", String)
], Department.prototype, "managerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department head email', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'manager_email' }),
    __metadata("design:type", String)
], Department.prototype, "managerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether department is active', default: true }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Department.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Department.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Department.prototype, "updatedAt", void 0);
exports.Department = Department = __decorate([
    (0, typeorm_1.Entity)('departments')
], Department);
//# sourceMappingURL=department.entity.js.map