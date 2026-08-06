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
exports.Posting = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Posting = class Posting {
    id;
    name;
    code;
    description;
    isActive;
    createdAt;
    updatedAt;
    employeeCount;
};
exports.Posting = Posting;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Posting.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting name', example: 'Headquarters' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Posting.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting code', example: 'HQ' }),
    (0, typeorm_1.Column)({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Posting.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting description', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Posting.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether posting is active', default: true }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Posting.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Posting.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Posting.prototype, "updatedAt", void 0);
exports.Posting = Posting = __decorate([
    (0, typeorm_1.Entity)('postings')
], Posting);
//# sourceMappingURL=posting.entity.js.map