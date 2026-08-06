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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const designations_service_1 = require("./designations.service");
const designation_dto_1 = require("./dto/designation.dto");
const designation_entity_1 = require("./entities/designation.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let DesignationsController = class DesignationsController {
    designationsService;
    constructor(designationsService) {
        this.designationsService = designationsService;
    }
    create(createDesignationDto) {
        return this.designationsService.create(createDesignationDto);
    }
    findAll(includeInactive) {
        return this.designationsService.findAll(includeInactive);
    }
    getStatistics() {
        return this.designationsService.getStatistics();
    }
    findOne(id) {
        return this.designationsService.findOne(id);
    }
    update(id, updateDesignationDto) {
        return this.designationsService.update(id, updateDesignationDto);
    }
    toggle(id) {
        return this.designationsService.toggle(id);
    }
    remove(id) {
        return this.designationsService.remove(id);
    }
};
exports.DesignationsController = DesignationsController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new designation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Designation created successfully',
        type: designation_entity_1.Designation,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [designation_dto_1.CreateDesignationDto]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all designations' }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of designations',
        type: [designation_entity_1.Designation],
    }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get designation statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Designation statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "getStatistics", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get designation by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Designation details',
        type: designation_entity_1.Designation,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update designation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Designation updated successfully',
        type: designation_entity_1.Designation,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, designation_dto_1.UpdateDesignationDto]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle designation active status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Designation status toggled',
        type: designation_entity_1.Designation,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "toggle", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete designation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Designation deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "remove", null);
exports.DesignationsController = DesignationsController = __decorate([
    (0, swagger_1.ApiTags)('designations'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('designations'),
    __metadata("design:paramtypes", [designations_service_1.DesignationsService])
], DesignationsController);
//# sourceMappingURL=designations.controller.js.map