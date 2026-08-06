"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employees_service_1 = require("./employees.service");
const employees_controller_1 = require("./employees.controller");
const employee_entity_1 = require("./entities/employee.entity");
const user_entity_1 = require("../audit/entities/user.entity");
const shifts_module_1 = require("../shifts/shifts.module");
const departments_module_1 = require("../departments/departments.module");
const designations_module_1 = require("../designations/designations.module");
const postings_module_1 = require("../postings/postings.module");
const fingerprint_module_1 = require("../fingerprint/fingerprint.module");
const config_1 = require("@nestjs/config");
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee, user_entity_1.User]),
            shifts_module_1.ShiftsModule,
            departments_module_1.DepartmentsModule,
            designations_module_1.DesignationsModule,
            postings_module_1.PostingsModule,
            fingerprint_module_1.FingerprintModule,
            config_1.ConfigModule,
        ],
        controllers: [employees_controller_1.EmployeesController],
        providers: [employees_service_1.EmployeesService],
        exports: [employees_service_1.EmployeesService],
    })
], EmployeesModule);
//# sourceMappingURL=employees.module.js.map