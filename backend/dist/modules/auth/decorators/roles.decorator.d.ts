import { UserRole } from '../../../common/enums';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const SUPER_ADMIN_ONLY: UserRole[];
export declare const MANAGE_ROLES: UserRole[];
export declare const STAFF_ROLES: UserRole[];
export declare const ANY_AUTHENTICATED: UserRole[];
