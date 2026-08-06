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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AuditLog = class AuditLog {
    id;
    userId;
    userName;
    action;
    entity;
    entityId;
    description;
    details;
    ipAddress;
    userAgent;
    result;
    errorMessage;
    timestamp;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who performed the action' }),
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User name for quick reference' }),
    (0, typeorm_1.Column)({ name: 'user_name' }),
    __metadata("design:type", String)
], AuditLog.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action performed', example: 'CREATE_EMPLOYEE' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity type affected', example: 'EMPLOYEE' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditLog.prototype, "entity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity ID affected', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'entity_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the action' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional details in JSON format', required: false }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'IP address of the requester', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'ip_address' }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User agent string', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'user_agent' }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Result of the action', example: 'SUCCESS' }),
    (0, typeorm_1.Column)({ default: 'SUCCESS' }),
    __metadata("design:type", String)
], AuditLog.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Error message if action failed', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'error_message' }),
    __metadata("design:type", String)
], AuditLog.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when action occurred' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'timestamp' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "timestamp", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs')
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map