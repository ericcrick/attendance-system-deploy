"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANY_AUTHENTICATED = exports.STAFF_ROLES = exports.MANAGE_ROLES = exports.SUPER_ADMIN_ONLY = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../common/enums");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.SUPER_ADMIN_ONLY = [enums_1.UserRole.SUPER_ADMIN];
exports.MANAGE_ROLES = [enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN];
exports.STAFF_ROLES = [enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SUPERVISOR];
exports.ANY_AUTHENTICATED = Object.values(enums_1.UserRole);
//# sourceMappingURL=roles.decorator.js.map