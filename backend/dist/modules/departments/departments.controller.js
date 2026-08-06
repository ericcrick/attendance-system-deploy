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
exports.DepartmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const departments_service_1 = require("./departments.service");
const department_dto_1 = require("./dto/department.dto");
const department_entity_1 = require("./entities/department.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let DepartmentsController = class DepartmentsController {
    departmentsService;
    constructor(departmentsService) {
        this.departmentsService = departmentsService;
    }
    create(createDepartmentDto) {
        return this.departmentsService.create(createDepartmentDto);
    }
    findAll(includeInactive) {
        return this.departmentsService.findAll(includeInactive);
    }
    getStatistics() {
        return this.departmentsService.getStatistics();
    }
    findOne(id) {
        return this.departmentsService.findOne(id);
    }
    update(id, updateDepartmentDto) {
        return this.departmentsService.update(id, updateDepartmentDto);
    }
    toggle(id) {
        return this.departmentsService.toggle(id);
    }
    remove(id) {
        return this.departmentsService.remove(id);
    }
};
exports.DepartmentsController = DepartmentsController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new department' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Department created successfully',
        type: department_entity_1.Department,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [department_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of departments',
        type: [department_entity_1.Department],
    }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get department statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "getStatistics", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get department by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department details',
        type: department_entity_1.Department,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update department' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department updated successfully',
        type: department_entity_1.Department,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, department_dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle department active status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department status toggled',
        type: department_entity_1.Department,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "toggle", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete department' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "remove", null);
exports.DepartmentsController = DepartmentsController = __decorate([
    (0, swagger_1.ApiTags)('departments'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('departments'),
    __metadata("design:paramtypes", [departments_service_1.DepartmentsService])
], DepartmentsController);
//# sourceMappingURL=departments.controller.js.map