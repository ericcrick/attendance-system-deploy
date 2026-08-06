"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const shifts_module_1 = require("./modules/shifts/shifts.module");
const employees_module_1 = require("./modules/employees/employees.module");
const auth_module_1 = require("./modules/auth/auth.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./modules/auth/guards/roles.guard");
const departments_module_1 = require("./modules/departments/departments.module");
const designations_module_1 = require("./modules/designations/designations.module");
const postings_module_1 = require("./modules/postings/postings.module");
const leaves_module_1 = require("./modules/leaves/leaves.module");
const fingerprint_module_1 = require("./modules/fingerprint/fingerprint.module");
const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
function validateEnv(config) {
    const missing = REQUIRED_ENV_VARS.filter((key) => !config[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variable(s): ${missing.join(', ')}. Check backend/.env.`);
    }
    return config;
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validate: validateEnv,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                    ssl: false,
                }),
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 300,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 20,
                },
            ]),
            auth_module_1.AuthModule,
            shifts_module_1.ShiftsModule,
            employees_module_1.EmployeesModule,
            attendance_module_1.AttendanceModule,
            departments_module_1.DepartmentsModule,
            designations_module_1.DesignationsModule,
            postings_module_1.PostingsModule,
            leaves_module_1.LeavesModule,
            fingerprint_module_1.FingerprintModule
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map