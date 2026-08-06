"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
const shift_entity_1 = require("../../modules/shifts/entities/shift.entity");
const enums_1 = require("../../common/enums");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../modules/audit/entities/user.entity");
async function seedInitialData(dataSource) {
    console.log('🌱 Starting database seeding...\n');
    console.log('📅 Seeding shifts...');
    const shiftRepository = dataSource.getRepository(shift_entity_1.Shift);
    const shifts = [
        {
            name: 'Morning Shift',
            startTime: '06:00',
            endTime: '14:00',
            gracePeriodMinutes: 15,
            description: 'Early morning operations shift',
            colorCode: '#3B82F6',
            isActive: true,
        },
        {
            name: 'Afternoon Shift',
            startTime: '14:00',
            endTime: '22:00',
            gracePeriodMinutes: 15,
            description: 'Afternoon to evening operations shift',
            colorCode: '#F59E0B',
            isActive: true,
        },
        {
            name: 'Night Shift',
            startTime: '22:00',
            endTime: '06:00',
            gracePeriodMinutes: 15,
            description: 'Night operations and security shift',
            colorCode: '#8B5CF6',
            isActive: true,
        },
        {
            name: 'Day Shift (9-5)',
            startTime: '09:00',
            endTime: '17:00',
            gracePeriodMinutes: 15,
            description: 'Standard day shift for administrative staff',
            colorCode: '#10B981',
            isActive: true,
        },
    ];
    for (const shiftData of shifts) {
        const existingShift = await shiftRepository.findOne({
            where: { name: shiftData.name },
        });
        if (!existingShift) {
            const shift = shiftRepository.create(shiftData);
            await shiftRepository.save(shift);
            console.log(`  ✓ Created shift: ${shiftData.name}`);
        }
        else {
            console.log(`  - Shift already exists: ${shiftData.name}`);
        }
    }
    console.log('\n👤 Seeding admin users...');
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const users = [
        {
            username: 'superadmin',
            email: 'superadmin@attendance.local',
            password: await bcrypt.hash('SuperAdmin@123', 10),
            firstName: 'Super',
            lastName: 'Admin',
            role: enums_1.UserRole.SUPER_ADMIN,
            isActive: true,
        },
        {
            username: 'admin',
            email: 'admin@attendance.local',
            password: await bcrypt.hash('Admin@123', 10),
            firstName: 'System',
            lastName: 'Administrator',
            role: enums_1.UserRole.ADMIN,
            isActive: true,
        },
    ];
    for (const userData of users) {
        const existingUser = await userRepository.findOne({
            where: { username: userData.username },
        });
        if (!existingUser) {
            const user = userRepository.create(userData);
            await userRepository.save(user);
            console.log(`  ✓ Created user: ${userData.username} (${userData.email})`);
            console.log(`    Password: ${userData.username === 'superadmin' ? 'SuperAdmin@123' : 'Admin@123'}`);
        }
        else {
            console.log(`  - User already exists: ${userData.username}`);
        }
    }
    console.log('\n✅ Database seeding completed!\n');
    console.log('📝 Default credentials:');
    console.log('   Super Admin: superadmin / SuperAdmin@123');
    console.log('   Admin: admin / Admin@123\n');
}
if (require.main === module) {
    const { DataSource } = require('typeorm');
    require('dotenv').config();
    const AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'attendance123',
        database: process.env.DB_NAME ?? 'attendance_system',
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: false,
    });
    AppDataSource.initialize()
        .then(async () => {
        await seedInitialData(AppDataSource);
        await AppDataSource.destroy();
        process.exit(0);
    })
        .catch((error) => {
        console.error('Error during seeding:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=initial-data.seeder.js.map