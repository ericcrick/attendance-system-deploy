import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../audit/entities/user.entity';
import { LoginDto, RegisterDto, ChangePasswordDto, UpdateUserDto } from './dto/auth.dto';
import { EmployeesService } from '../employees/employees.service';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private employeesService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, employeesService: EmployeesService);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    validateUser(userId: string): Promise<User>;
    getProfile(userId: string): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    toggleUserStatus(id: string, actingUserId: string): Promise<User>;
    resetPassword(id: string): Promise<{
        temporaryPassword: string;
    }>;
    deleteUser(id: string, actingUserId: string): Promise<void>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    linkEmployee(id: string, employeeId: string | null | undefined): Promise<User>;
}
