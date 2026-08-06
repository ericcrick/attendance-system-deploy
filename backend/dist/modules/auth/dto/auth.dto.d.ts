import { UserRole } from '../../../common/enums';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
}
export declare class LinkEmployeeDto {
    employeeId?: string | null;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    };
}
