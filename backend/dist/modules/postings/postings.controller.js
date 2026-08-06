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
exports.PostingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const postings_service_1 = require("./postings.service");
const posting_dto_1 = require("./dto/posting.dto");
const posting_entity_1 = require("./entities/posting.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PostingsController = class PostingsController {
    postingsService;
    constructor(postingsService) {
        this.postingsService = postingsService;
    }
    create(createPostingDto) {
        return this.postingsService.create(createPostingDto);
    }
    findAll(includeInactive) {
        return this.postingsService.findAll(includeInactive);
    }
    getStatistics() {
        return this.postingsService.getStatistics();
    }
    findOne(id) {
        return this.postingsService.findOne(id);
    }
    update(id, updatePostingDto) {
        return this.postingsService.update(id, updatePostingDto);
    }
    toggle(id) {
        return this.postingsService.toggle(id);
    }
    remove(id) {
        return this.postingsService.remove(id);
    }
};
exports.PostingsController = PostingsController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new posting' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Posting created successfully',
        type: posting_entity_1.Posting,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [posting_dto_1.CreatePostingDto]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all postings' }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of postings',
        type: [posting_entity_1.Posting],
    }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get posting statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posting statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "getStatistics", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.STAFF_ROLES),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get posting by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posting details',
        type: posting_entity_1.Posting,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update posting' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posting updated successfully',
        type: posting_entity_1.Posting,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, posting_dto_1.UpdatePostingDto]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle posting active status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posting status toggled',
        type: posting_entity_1.Posting,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "toggle", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete posting' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posting deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "remove", null);
exports.PostingsController = PostingsController = __decorate([
    (0, swagger_1.ApiTags)('postings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('postings'),
    __metadata("design:paramtypes", [postings_service_1.PostingsService])
], PostingsController);
//# sourceMappingURL=postings.controller.js.map