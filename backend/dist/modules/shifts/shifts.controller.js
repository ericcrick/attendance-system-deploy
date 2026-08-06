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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shifts_service_1 = require("./shifts.service");
const create_shift_dto_1 = require("./dto/create-shift.dto");
const shift_entity_1 = require("./entities/shift.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ShiftsController = class ShiftsController {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    create(createShiftDto) {
        return this.shiftsService.create(createShiftDto);
    }
    findAll() {
        return this.shiftsService.findAll();
    }
    findActive() {
        return this.shiftsService.findActive();
    }
    getCurrentShift() {
        return this.shiftsService.getCurrentShift();
    }
    findOne(id) {
        return this.shiftsService.findOne(id);
    }
    update(id, updateShiftDto) {
        return this.shiftsService.update(id, updateShiftDto);
    }
    toggleActive(id) {
        return this.shiftsService.toggleActive(id);
    }
    remove(id) {
        return this.shiftsService.remove(id);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new shift' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Shift created successfully',
        type: shift_entity_1.Shift,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Shift name already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid shift data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shift_dto_1.CreateShiftDto]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all shifts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all shifts',
        type: [shift_entity_1.Shift],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active shifts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active shifts',
        type: [shift_entity_1.Shift],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findActive", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current active shift based on time' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current shift or null',
        type: shift_entity_1.Shift,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getCurrentShift", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a shift by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shift details',
        type: shift_entity_1.Shift,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shift not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a shift' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shift updated successfully',
        type: shift_entity_1.Shift,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shift not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Shift name already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_shift_dto_1.UpdateShiftDto]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle shift active status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shift status toggled',
        type: shift_entity_1.Shift,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shift not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "toggleActive", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a shift' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Shift deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shift not found' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete shift with assigned employees',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "remove", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, swagger_1.ApiTags)('shifts'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('shifts'),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map