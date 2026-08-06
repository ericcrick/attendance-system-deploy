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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../audit/entities/user.entity");
const enums_1 = require("../../common/enums");
const employees_service_1 = require("../employees/employees.service");
const generate_password_1 = require("../../common/utils/generate-password");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    employeesService;
    constructor(usersRepository, jwtService, employeesService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.employeesService = employeesService;
    }
    async register(registerDto) {
        const existingUsername = await this.usersRepository.findOne({
            where: { username: registerDto.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username already exists');
        }
        const existingEmail = await this.usersRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already exists');
        }
        const user = this.usersRepository.create({
            ...registerDto,
            role: registerDto.role || enums_1.UserRole.ADMIN,
        });
        return this.usersRepository.save(user);
    }
    async login(loginDto) {
        const user = await this.usersRepository.findOne({
            where: [
                { username: loginDto.username },
                { email: loginDto.username },
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const isPasswordValid = await user.validatePassword(loginDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLogin = new Date();
        await this.usersRepository.save(user);
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                employeeId: user.employeeId,
            },
        };
    }
    async validateUser(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return user;
    }
    async getProfile(userId) {
        return this.validateUser(userId);
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.validateUser(userId);
        const isCurrentPasswordValid = await user.validatePassword(changePasswordDto.currentPassword);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        user.password = changePasswordDto.newPassword;
        await this.usersRepository.save(user);
    }
    async getAllUsers() {
        return this.usersRepository.find({
            relations: ['employee'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUserById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async toggleUserStatus(id, actingUserId) {
        if (id === actingUserId) {
            throw new common_1.BadRequestException('You cannot deactivate your own account');
        }
        const user = await this.getUserById(id);
        user.isActive = !user.isActive;
        return this.usersRepository.save(user);
    }
    async resetPassword(id) {
        const user = await this.getUserById(id);
        const temporaryPassword = (0, generate_password_1.generateTemporaryPassword)();
        user.password = temporaryPassword;
        await this.usersRepository.save(user);
        return { temporaryPassword };
    }
    async deleteUser(id, actingUserId) {
        if (id === actingUserId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        const user = await this.getUserById(id);
        await this.usersRepository.remove(user);
    }
    async updateUser(id, updateUserDto) {
        const user = await this.getUserById(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingEmail = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingEmail && existingEmail.id !== id) {
                throw new common_1.ConflictException(`Email "${updateUserDto.email}" is already in use`);
            }
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async linkEmployee(id, employeeId) {
        await this.getUserById(id);
        if (!employeeId) {
            await this.usersRepository.update(id, { employeeId: null });
            return this.getUserById(id);
        }
        try {
            await this.employeesService.findOne(employeeId);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Employee with ID "${employeeId}" not found`);
        }
        const existingLink = await this.usersRepository.findOne({
            where: { employeeId },
        });
        if (existingLink && existingLink.id !== id) {
            throw new common_1.ConflictException(`This employee is already linked to another user account (${existingLink.username})`);
        }
        await this.usersRepository.update(id, { employeeId });
        return this.getUserById(id);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        employees_service_1.EmployeesService])
], AuthService);
//# sourceMappingURL=auth.service.js.map