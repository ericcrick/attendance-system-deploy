import { UserRole } from '../../../common/enums';
import { Employee } from '../../employees/entities/employee.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
    employeeId?: string;
    employee?: Employee;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    get fullName(): string;
}
