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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const roles_decorator_1 = require("./decorators/roles.decorator");
const user_entity_1 = require("../audit/entities/user.entity");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
    async changePassword(req, changePasswordDto) {
        await this.authService.changePassword(req.user.id, changePasswordDto);
        return { message: 'Password changed successfully' };
    }
    async getAllUsers() {
        return this.authService.getAllUsers();
    }
    async getUserById(id) {
        return this.authService.getUserById(id);
    }
    async updateUser(id, updateUserDto) {
        return this.authService.updateUser(id, updateUserDto);
    }
    async linkEmployee(id, linkEmployeeDto) {
        return this.authService.linkEmployee(id, linkEmployeeDto.employeeId);
    }
    async toggleUserStatus(id, req) {
        return this.authService.toggleUserStatus(id, req.user.id);
    }
    async resetPassword(id) {
        return this.authService.resetPassword(id);
    }
    async deleteUser(id, req) {
        return this.authService.deleteUser(id, req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new admin user (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Username or email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login to get JWT token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: auth_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.ANY_AUTHENTICATED),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Current password is incorrect' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of users',
        type: [user_entity_1.User],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.MANAGE_ROLES),
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User details',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserById", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Patch)('users/:id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Patch)('users/:id/link-employee'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Link or unlink a user to an employee record (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee link updated',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Employee already linked to another user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.LinkEmployeeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkEmployee", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Patch)('users/:id/toggle-status'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle user active status (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User status toggled',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate your own account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "toggleUserStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Patch)('users/:id/reset-password'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: "Reset a user's password to a new temporary one (Super Admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset — returns the new temporary password (shown once)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, roles_decorator_1.Roles)(...roles_decorator_1.SUPER_ADMIN_ONLY),
    (0, common_1.Delete)('users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete your own account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map