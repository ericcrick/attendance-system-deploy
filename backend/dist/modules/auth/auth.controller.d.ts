import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto, LoginResponseDto, UpdateUserDto, LinkEmployeeDto } from './dto/auth.dto';
import { User } from '../audit/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    getProfile(req: any): Promise<User>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    linkEmployee(id: string, linkEmployeeDto: LinkEmployeeDto): Promise<User>;
    toggleUserStatus(id: string, req: any): Promise<User>;
    resetPassword(id: string): Promise<{
        temporaryPassword: string;
    }>;
    deleteUser(id: string, req: any): Promise<void>;
}
