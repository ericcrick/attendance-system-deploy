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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const employees_service_1 = require("./employees.service");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const employee_entity_1 = require("./entities/employee.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let EmployeesController = class EmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    create(createEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }
    findAll(includeInactive, search) {
        return this.employeesService.findAll(includeInactive, search);
    }
    getStatistics() {
        return this.employeesService.getStatistics();
    }
    findMe(req) {
        return this.employeesService.findMe(req.user.employeeId);
    }
    findByDepartment(department) {
        return this.employeesService.findByDepartment(department);
    }
    findByShift(shiftId) {
        return this.employeesService.findByShift(shiftId);
    }
    findOne(id) {
        return this.employeesService.findOne(id);
    }
    update(id, updateEmployeeDto) {
        return this.employeesService.update(id, updateEmployeeDto);
    }
    deactivate(id) {
        return this.employeesService.deactivate(id);
    }
    activate(id) {
        return this.employeesService.activate(id);
    }
    assignRfidCard(id, assignRfidDto) {
        return this.employeesService.assignRfidCard(id, assignRfidDto);
    }
    removeRfidCard(id) {
        return this.employeesService.removeRfidCard(id);
    }
    assignFingerprint(id, assignFingerprintDto) {
        return this.employeesService.assignFingerprint(id, assignFingerprintDto);
    }
    removeFingerprint(id) {
        return this.employeesService.removeFingerprint(id);
    }
    remove(id) {
        return this.employeesService.remove(id);
    }
    uploadPhoto(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('No photo file provided');
        }
        return this.employeesService.updatePhoto(id, `/uploads/employees/${file.filename}`);
    }
    removePhoto(id) {
        return this.employeesService.removePhoto(id);
    }
    async testFingerprintService() {
        return this.employeesService.testFingerprintService();
    }
    async compareFingerprints(body) {
        const score = await this.employeesService['fingerprintService']
            .compareFingerprintTemplates(body.template1, body.template2);
        return {
            similarityScore: score,
            matched: score >= 70,
            threshold: 70,
        };
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee (also auto-provisions a login account)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Employee created successfully, with the new login\'s credentials if one was provisioned',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Employee ID or email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid employee data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Include inactive employees',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by name or service number — when provided, results are capped to the top 20 matches',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of employees',
        type: [employee_entity_1.Employee],
    }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getStatistics", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: "Get the logged-in user's own employee record" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Own employee details',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Account not linked to an employee record' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('department/:department'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employees by department' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of employees in department',
        type: [employee_entity_1.Employee],
    }),
    __param(0, (0, common_1.Param)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findByDepartment", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('shift/:shiftId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employees by shift' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of employees in shift',
        type: [employee_entity_1.Employee],
    }),
    __param(0, (0, common_1.Param)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findByShift", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an employee by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee details',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee updated successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or RFID already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate an employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee deactivated',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate an employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee activated',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "activate", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/assign-rfid'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign RFID card to employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'RFID card assigned',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'RFID card already assigned' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_employee_dto_1.AssignRfidDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "assignRfidCard", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id/rfid'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove RFID card from employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'RFID card removed successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No RFID card assigned' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "removeRfidCard", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/assign-fingerprint'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign fingerprint to employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fingerprint assigned successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid fingerprint template data' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_employee_dto_1.AssignFingerprintDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "assignFingerprint", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id/fingerprint'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove fingerprint from employee' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fingerprint removed successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No fingerprint enrolled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "removeFingerprint", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an employee' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Employee deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(':id/photo'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads/employees',
            filename: (req, file, callback) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                callback(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
                callback(new common_1.BadRequestException('Only JPEG, PNG, or WEBP images are allowed'), false);
                return;
            }
            callback(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload employee photo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo uploaded successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or missing image file' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "uploadPhoto", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id/photo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove employee photo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo removed successfully',
        type: employee_entity_1.Employee,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No photo uploaded' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "removePhoto", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Get)('fingerprint/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test fingerprint service' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "testFingerprintService", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)('fingerprint/compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare two fingerprint templates (testing)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "compareFingerprints", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map