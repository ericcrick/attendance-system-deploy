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
exports.LeavesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const leaves_service_1 = require("./leaves.service");
const leave_dto_1 = require("./dto/leave.dto");
const leave_entity_1 = require("./entities/leave.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/(jpeg|png|webp))$/;
let LeavesController = class LeavesController {
    leavesService;
    constructor(leavesService) {
        this.leavesService = leavesService;
    }
    create(createLeaveDto, req) {
        return this.leavesService.create(createLeaveDto, req.user);
    }
    uploadAttachment(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return { url: `/uploads/leave-attachments/${file.filename}` };
    }
    findAll(req, startDate, endDate, status, employeeId) {
        return this.leavesService.findAll(startDate, endDate, status, employeeId, req.user);
    }
    getStatistics() {
        return this.leavesService.getStatistics();
    }
    findOne(id, req) {
        return this.leavesService.findOne(id, req.user);
    }
    update(id, updateLeaveDto, req) {
        return this.leavesService.update(id, updateLeaveDto, req.user);
    }
    review(id, reviewLeaveDto, req) {
        return this.leavesService.review(id, reviewLeaveDto, req.user.id, req.user.employeeId);
    }
    remove(id, req) {
        return this.leavesService.remove(id, req.user);
    }
};
exports.LeavesController = LeavesController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new leave request (staff: for anyone; everyone else: for themselves only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Leave request created successfully',
        type: leave_entity_1.Leave,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_dto_1.CreateLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Post)('upload-attachment'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads/leave-attachments',
            filename: (req, file, callback) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                callback(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!ALLOWED_ATTACHMENT_TYPES.test(file.mimetype)) {
                callback(new common_1.BadRequestException('Only PDF, Word, JPEG, PNG, or WEBP files are allowed'), false);
                return;
            }
            callback(null, true);
        },
        limits: { fileSize: MAX_ATTACHMENT_SIZE },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a supporting document for a leave request (max 2MB)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File uploaded, returns its URL' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid, missing, or oversized file' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], LeavesController.prototype, "uploadAttachment", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave requests (staff: everyone; everyone else: their own only)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: leave_entity_1.LeaveStatus }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of leave requests',
        type: [leave_entity_1.Leave],
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "getStatistics", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave by ID (staff: any; everyone else: their own only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave details',
        type: leave_entity_1.Leave,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not your leave request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update leave request (staff: any pending; everyone else: their own pending only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave updated successfully',
        type: leave_entity_1.Leave,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not your leave request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, leave_dto_1.UpdateLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Patch)(':id/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject leave request' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave reviewed successfully',
        type: leave_entity_1.Leave,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot review your own leave request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, leave_dto_1.ReviewLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "review", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete/cancel leave request (staff: any; everyone else: their own pending only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not your leave request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeavesController.prototype, "remove", null);
exports.LeavesController = LeavesController = __decorate([
    (0, swagger_1.ApiTags)('leaves'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('leaves'),
    __metadata("design:paramtypes", [leaves_service_1.LeavesService])
], LeavesController);
//# sourceMappingURL=leaves.controller.js.map