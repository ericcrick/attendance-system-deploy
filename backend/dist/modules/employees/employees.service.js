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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmployeesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const employee_entity_1 = require("./entities/employee.entity");
const shifts_service_1 = require("../shifts/shifts.service");
const departments_service_1 = require("../departments/departments.service");
const designations_service_1 = require("../designations/designations.service");
const postings_service_1 = require("../postings/postings.service");
const zkteco_service_1 = require("../fingerprint/zkteco.service");
const enums_1 = require("../../common/enums");
const fingerprint_service_interface_1 = require("../fingerprint/fingerprint-service.interface");
const user_entity_1 = require("../audit/entities/user.entity");
const generate_password_1 = require("../../common/utils/generate-password");
let EmployeesService = EmployeesService_1 = class EmployeesService {
    employeesRepository;
    usersRepository;
    shiftsService;
    departmentsService;
    designationsService;
    postingsService;
    fingerprintService;
    zkTecoService;
    logger = new common_1.Logger(EmployeesService_1.name);
    constructor(employeesRepository, usersRepository, shiftsService, departmentsService, designationsService, postingsService, fingerprintService, zkTecoService) {
        this.employeesRepository = employeesRepository;
        this.usersRepository = usersRepository;
        this.shiftsService = shiftsService;
        this.departmentsService = departmentsService;
        this.designationsService = designationsService;
        this.postingsService = postingsService;
        this.fingerprintService = fingerprintService;
        this.zkTecoService = zkTecoService;
    }
    async create(createEmployeeDto) {
        const existingEmployee = await this.employeesRepository.findOne({
            where: { employeeId: createEmployeeDto.employeeId },
        });
        if (existingEmployee) {
            throw new common_1.ConflictException(`Employee with ID "${createEmployeeDto.employeeId}" already exists`);
        }
        if (createEmployeeDto.email) {
            const existingEmail = await this.employeesRepository.findOne({
                where: { email: createEmployeeDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException(`Employee with email "${createEmployeeDto.email}" already exists`);
            }
        }
        if (createEmployeeDto.rfidCardId) {
            const existingRfid = await this.employeesRepository.findOne({
                where: { rfidCardId: createEmployeeDto.rfidCardId },
            });
            if (existingRfid) {
                throw new common_1.ConflictException(`RFID card "${createEmployeeDto.rfidCardId}" is already assigned`);
            }
        }
        await this.shiftsService.findOne(createEmployeeDto.shiftId);
        if (createEmployeeDto.departmentId) {
            try {
                const department = await this.departmentsService.findOne(createEmployeeDto.departmentId);
                if (!createEmployeeDto.department) {
                    createEmployeeDto.department = department.name;
                }
            }
            catch (error) {
                throw new common_1.BadRequestException(`Department with ID "${createEmployeeDto.departmentId}" not found`);
            }
        }
        try {
            await this.designationsService.findOne(createEmployeeDto.designationId);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Designation with ID "${createEmployeeDto.designationId}" not found`);
        }
        try {
            await this.postingsService.findOne(createEmployeeDto.postingId);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Posting with ID "${createEmployeeDto.postingId}" not found`);
        }
        const employee = this.employeesRepository.create({
            ...createEmployeeDto,
            status: createEmployeeDto.status || enums_1.EmploymentStatus.ACTIVE,
        });
        const saved = await this.employeesRepository.save(employee);
        const credentials = await this.createLoginForEmployee(saved);
        return { employee: saved, credentials };
    }
    async createLoginForEmployee(employee) {
        try {
            const baseUsername = employee.employeeId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'employee';
            let username = baseUsername;
            let usernameSuffix = 0;
            while (await this.usersRepository.findOne({ where: { username } })) {
                usernameSuffix += 1;
                username = `${baseUsername}${usernameSuffix}`;
            }
            let email = employee.email;
            if (!email || (await this.usersRepository.findOne({ where: { email } }))) {
                email = `${username}@attendance.local`;
                let emailSuffix = 0;
                while (await this.usersRepository.findOne({ where: { email } })) {
                    emailSuffix += 1;
                    email = `${username}${emailSuffix}@attendance.local`;
                }
            }
            const temporaryPassword = (0, generate_password_1.generateTemporaryPassword)();
            const user = this.usersRepository.create({
                username,
                email,
                password: temporaryPassword,
                firstName: employee.firstName,
                lastName: employee.lastName,
                role: enums_1.UserRole.EMPLOYEE,
                employeeId: employee.id,
            });
            await this.usersRepository.save(user);
            return { username, temporaryPassword };
        }
        catch (error) {
            this.logger.warn(`Failed to auto-create login for employee "${employee.employeeId}": ${error}`);
            return undefined;
        }
    }
    async findAll(includeInactive = false, search) {
        const queryBuilder = this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .orderBy('employee.createdAt', 'DESC');
        if (!includeInactive) {
            queryBuilder.where('employee.status = :status', {
                status: enums_1.EmploymentStatus.ACTIVE,
            });
        }
        if (search) {
            const term = `%${search}%`;
            queryBuilder.andWhere('(employee.firstName ILIKE :term OR employee.lastName ILIKE :term OR employee.middleName ILIKE :term OR employee.employeeId ILIKE :term)', { term });
            queryBuilder.take(20);
        }
        return queryBuilder.getMany();
    }
    async findByDepartment(department) {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .where('employee.department = :department', { department })
            .andWhere('employee.status = :status', { status: enums_1.EmploymentStatus.ACTIVE })
            .orderBy('employee.lastName', 'ASC')
            .getMany();
    }
    async findByDepartmentId(departmentId) {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .where('employee.department_id = :departmentId', { departmentId })
            .andWhere('employee.status = :status', { status: enums_1.EmploymentStatus.ACTIVE })
            .orderBy('employee.lastName', 'ASC')
            .getMany();
    }
    async findByShift(shiftId) {
        return this.employeesRepository.find({
            where: {
                shiftId,
                status: enums_1.EmploymentStatus.ACTIVE,
            },
            relations: ['shift', 'departmentRelation', 'designation', 'posting'],
            order: { lastName: 'ASC' },
        });
    }
    async findOne(id) {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['shift', 'departmentRelation', 'designation', 'posting', 'attendances'],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID "${id}" not found`);
        }
        return employee;
    }
    async findMe(employeeId) {
        if (!employeeId) {
            throw new common_1.NotFoundException('Your account is not linked to an employee record. Contact HR to get linked.');
        }
        return this.findOne(employeeId);
    }
    async findByEmployeeId(employeeId) {
        const employee = await this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .where('LOWER(employee.employee_id) = LOWER(:employeeId)', { employeeId })
            .getOne();
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID "${employeeId}" not found`);
        }
        return employee;
    }
    async findByRfidCard(rfidCardId) {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .where('LOWER(employee.rfid_card_id) = LOWER(:rfidCardId)', { rfidCardId })
            .getOne();
    }
    async findByFingerprintDeviceId(deviceId) {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.shift', 'shift')
            .leftJoinAndSelect('employee.departmentRelation', 'departmentRelation')
            .leftJoinAndSelect('employee.designation', 'designation')
            .leftJoinAndSelect('employee.posting', 'posting')
            .where('employee.fingerprint_device_id = :deviceId', { deviceId })
            .getOne();
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
            const existingEmail = await this.employeesRepository.findOne({
                where: { email: updateEmployeeDto.email },
            });
            if (existingEmail && existingEmail.id !== id) {
                throw new common_1.ConflictException(`Email "${updateEmployeeDto.email}" is already in use`);
            }
        }
        if (updateEmployeeDto.rfidCardId &&
            updateEmployeeDto.rfidCardId !== employee.rfidCardId) {
            const existingRfid = await this.employeesRepository.findOne({
                where: { rfidCardId: updateEmployeeDto.rfidCardId },
            });
            if (existingRfid && existingRfid.id !== id) {
                throw new common_1.ConflictException(`RFID card "${updateEmployeeDto.rfidCardId}" is already assigned`);
            }
        }
        if (updateEmployeeDto.shiftId && updateEmployeeDto.shiftId !== employee.shiftId) {
            await this.shiftsService.findOne(updateEmployeeDto.shiftId);
        }
        if (updateEmployeeDto.departmentId) {
            try {
                const department = await this.departmentsService.findOne(updateEmployeeDto.departmentId);
                if (!updateEmployeeDto.department) {
                    updateEmployeeDto.department = department.name;
                }
            }
            catch (error) {
                throw new common_1.BadRequestException(`Department with ID "${updateEmployeeDto.departmentId}" not found`);
            }
        }
        if (updateEmployeeDto.designationId) {
            try {
                await this.designationsService.findOne(updateEmployeeDto.designationId);
            }
            catch (error) {
                throw new common_1.BadRequestException(`Designation with ID "${updateEmployeeDto.designationId}" not found`);
            }
        }
        if (updateEmployeeDto.postingId) {
            try {
                await this.postingsService.findOne(updateEmployeeDto.postingId);
            }
            catch (error) {
                throw new common_1.BadRequestException(`Posting with ID "${updateEmployeeDto.postingId}" not found`);
            }
        }
        Object.assign(employee, updateEmployeeDto);
        return this.employeesRepository.save(employee);
    }
    async remove(id) {
        const employee = await this.findOne(id);
        if (employee.fingerprintDeviceId) {
            await this.zkTecoService.deleteFingerprintFromDevice(employee.fingerprintDeviceId);
        }
        await this.employeesRepository.remove(employee);
    }
    async deactivate(id) {
        const employee = await this.findOne(id);
        employee.status = enums_1.EmploymentStatus.INACTIVE;
        return this.employeesRepository.save(employee);
    }
    async activate(id) {
        const employee = await this.findOne(id);
        employee.status = enums_1.EmploymentStatus.ACTIVE;
        return this.employeesRepository.save(employee);
    }
    async updatePhoto(id, photoUrl) {
        const employee = await this.findOne(id);
        const previousPhotoUrl = employee.photoUrl;
        employee.photoUrl = photoUrl;
        const saved = await this.employeesRepository.save(employee);
        if (previousPhotoUrl) {
            this.deletePhotoFile(previousPhotoUrl);
        }
        return saved;
    }
    async removePhoto(id) {
        const employee = await this.findOne(id);
        if (!employee.photoUrl) {
            throw new common_1.BadRequestException('No photo uploaded for this employee');
        }
        const previousPhotoUrl = employee.photoUrl;
        employee.photoUrl = null;
        const saved = await this.employeesRepository.save(employee);
        this.deletePhotoFile(previousPhotoUrl);
        return saved;
    }
    deletePhotoFile(photoUrl) {
        try {
            const filename = path.basename(photoUrl);
            const filePath = path.join(process.cwd(), 'uploads', 'employees', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            this.logger.warn(`Failed to delete photo file for "${photoUrl}": ${error}`);
        }
    }
    async assignRfidCard(id, assignRfidDto) {
        const employee = await this.findOne(id);
        const existingRfid = await this.employeesRepository.findOne({
            where: { rfidCardId: assignRfidDto.rfidCardId },
        });
        if (existingRfid && existingRfid.id !== id) {
            throw new common_1.ConflictException(`RFID card "${assignRfidDto.rfidCardId}" is already assigned to ${existingRfid.fullName}`);
        }
        employee.rfidCardId = assignRfidDto.rfidCardId;
        return this.employeesRepository.save(employee);
    }
    async removeRfidCard(id) {
        const employee = await this.findOne(id);
        if (!employee.rfidCardId) {
            throw new common_1.BadRequestException('No RFID card assigned to this employee');
        }
        employee.rfidCardId = null;
        return this.employeesRepository.save(employee);
    }
    async removeFingerprint(id) {
        const employee = await this.findOne(id);
        if (!employee.fingerprintTemplate) {
            throw new common_1.BadRequestException('No fingerprint enrolled for this employee');
        }
        if (employee.fingerprintDeviceId) {
            await this.fingerprintService.deleteFingerprintFromDevice(employee.fingerprintDeviceId);
        }
        employee.fingerprintTemplate = null;
        employee.fingerprintDeviceId = null;
        this.logger.log(`🗑️ Fingerprint removed for ${employee.fullName} (${employee.employeeId})`);
        return this.employeesRepository.save(employee);
    }
    async getStatistics() {
        const [total, active, inactive, suspended, terminated] = await Promise.all([
            this.employeesRepository.count(),
            this.employeesRepository.count({
                where: { status: enums_1.EmploymentStatus.ACTIVE },
            }),
            this.employeesRepository.count({
                where: { status: enums_1.EmploymentStatus.INACTIVE },
            }),
            this.employeesRepository.count({
                where: { status: enums_1.EmploymentStatus.SUSPENDED },
            }),
            this.employeesRepository.count({
                where: { status: enums_1.EmploymentStatus.TERMINATED },
            }),
        ]);
        const withRfid = await this.employeesRepository
            .createQueryBuilder('employee')
            .where('employee.rfid_card_id IS NOT NULL')
            .andWhere('employee.status = :status', { status: enums_1.EmploymentStatus.ACTIVE })
            .getCount();
        const withFingerprint = await this.employeesRepository
            .createQueryBuilder('employee')
            .where('employee.fingerprint_template IS NOT NULL')
            .andWhere('employee.status = :status', {
            status: enums_1.EmploymentStatus.ACTIVE,
        })
            .getCount();
        return {
            total,
            byStatus: {
                active,
                inactive,
                suspended,
                terminated,
            },
            byAuthMethod: {
                withRfid,
                withFingerprint,
            },
        };
    }
    async testFingerprintService() {
        return this.fingerprintService.testConnection();
    }
    async getFingerprintDeviceInfo() {
        return this.zkTecoService.getDeviceInfo();
    }
    async testFingerprintDeviceConnection() {
        return this.zkTecoService.testConnection();
    }
    async syncAllFingerprintsToDevice() {
        const employees = await this.findAll(false);
        const employeesWithFingerprints = employees
            .filter((emp) => emp.fingerprintTemplate && emp.fingerprintTemplate.length > 0)
            .map((emp) => ({
            id: emp.id,
            employeeId: emp.employeeId,
            fingerprintTemplate: emp.fingerprintTemplate,
        }));
        if (employeesWithFingerprints.length === 0) {
            return {
                success: 0,
                failed: 0,
                message: 'No employees with fingerprints found',
            };
        }
        const result = await this.zkTecoService.syncFingerprintsToDevice(employeesWithFingerprints);
        return {
            ...result,
            message: `Synced ${result.success} fingerprints successfully, ${result.failed} failed`,
        };
    }
    async assignFingerprint(id, assignFingerprintDto) {
        const employee = await this.findOne(id);
        if (!this.fingerprintService.validateFingerprintTemplate(assignFingerprintDto.fingerprintTemplate)) {
            throw new common_1.BadRequestException('Invalid fingerprint template. Please scan again.');
        }
        const normalizedTemplate = this.fingerprintService.normalizeTemplate(assignFingerprintDto.fingerprintTemplate);
        const templateHash = this.fingerprintService.createTemplateHash(normalizedTemplate);
        this.logger.log(`📊 Template: ${normalizedTemplate.length} chars`);
        this.logger.log(`📊 Hash: ${templateHash}`);
        let sourceAfisTemplate = null;
        if (assignFingerprintDto.fingerprintImage) {
            try {
                this.logger.log('🖼️ Extracting SourceAFIS template from image...');
                const matcherClient = this.fingerprintService['matcherClient'];
                if (matcherClient) {
                    const extractResult = await matcherClient.extractFromImage(assignFingerprintDto.fingerprintImage, 'png');
                    if (extractResult.success && extractResult.template) {
                        sourceAfisTemplate = extractResult.template;
                        this.logger.log(`✅ SourceAFIS template extracted: ${extractResult.minutiaeCount} minutiae`);
                        if (extractResult.minutiaeCount < 12) {
                            this.logger.warn(`⚠️ Low quality fingerprint: only ${extractResult.minutiaeCount} minutiae (recommend 12+)`);
                        }
                    }
                    else {
                        this.logger.warn(`⚠️ SourceAFIS extraction failed: ${extractResult.message}`);
                    }
                }
            }
            catch (error) {
                this.logger.error('❌ Failed to extract SourceAFIS template:', error);
            }
        }
        const duplicateByHash = await this.employeesRepository.findOne({
            where: { fingerprintHash: templateHash },
        });
        if (duplicateByHash && duplicateByHash.id !== id) {
            this.logger.warn(`⚠️ Hash collision detected with ${duplicateByHash.fullName}`);
            throw new common_1.ConflictException(`This exact fingerprint is already enrolled for ${duplicateByHash.fullName}.`);
        }
        if (sourceAfisTemplate) {
            const duplicateBySourceAfis = await this.verifyFingerprintWithSourceAfis(sourceAfisTemplate);
            if (duplicateBySourceAfis && duplicateBySourceAfis.id !== id) {
                this.logger.warn(`⚠️ SourceAFIS match detected with ${duplicateBySourceAfis.fullName}`);
                throw new common_1.ConflictException(`This fingerprint appears to be already enrolled for ${duplicateBySourceAfis.fullName}.`);
            }
        }
        const deviceUserId = await this.fingerprintService.enrollFingerprintOnDevice(employee.employeeId, normalizedTemplate);
        employee.fingerprintTemplate = normalizedTemplate;
        employee.fingerprintHash = templateHash;
        employee.fingerprintImage = assignFingerprintDto.fingerprintImage || undefined;
        employee.fingerprintSourceAfisTemplate = sourceAfisTemplate || undefined;
        employee.fingerprintDeviceId =
            assignFingerprintDto.fingerprintDeviceId || deviceUserId;
        this.logger.log(`✅ Enrolled: ${employee.fullName} (${employee.employeeId})`);
        this.logger.log(`📊 Storage: DigitalPersona=${!!employee.fingerprintTemplate}, SourceAFIS=${!!sourceAfisTemplate}, Image=${!!employee.fingerprintImage}`);
        return this.employeesRepository.save(employee);
    }
    async verifyFingerprintWithSourceAfis(sourceAfisTemplate) {
        const employees = await this.findAll(false);
        const employeesWithSourceAfis = employees.filter((emp) => emp.fingerprintSourceAfisTemplate &&
            emp.fingerprintSourceAfisTemplate.length > 0);
        if (employeesWithSourceAfis.length === 0) {
            return null;
        }
        this.logger.log(`🔍 Checking against ${employeesWithSourceAfis.length} SourceAFIS templates`);
        const matcherClient = this.fingerprintService['matcherClient'];
        if (!matcherClient) {
            return null;
        }
        let bestMatch = null;
        let highestScore = 0;
        for (const employee of employeesWithSourceAfis) {
            try {
                const result = await matcherClient.compare(sourceAfisTemplate, employee.fingerprintSourceAfisTemplate);
                if (result.matched && result.score > highestScore) {
                    highestScore = result.score;
                    bestMatch = employee;
                }
            }
            catch (error) {
                this.logger.error(`❌ Error comparing with ${employee.employeeId}:`, error);
            }
        }
        return bestMatch;
    }
    async verifyFingerprint(fingerprintTemplate) {
        const startTime = Date.now();
        if (!this.fingerprintService.validateFingerprintTemplate(fingerprintTemplate)) {
            this.logger.warn('❌ Invalid fingerprint template provided');
            return null;
        }
        const normalizedInput = this.fingerprintService.normalizeTemplate(fingerprintTemplate);
        const employees = await this.findAll(false);
        const employeesWithSourceAfis = employees.filter((emp) => emp.fingerprintSourceAfisTemplate && emp.fingerprintSourceAfisTemplate.length > 0);
        const employeesWithDigitalPersonaOnly = employees.filter((emp) => emp.fingerprintTemplate && !emp.fingerprintSourceAfisTemplate);
        this.logger.log(`🔍 Verifying against ${employees.length} employees: ${employeesWithSourceAfis.length} with SourceAFIS, ${employeesWithDigitalPersonaOnly.length} DigitalPersona only`);
        let bestMatch = null;
        let highestScore = 0;
        this.logger.log('🔄 Using DigitalPersona template matching (SourceAFIS not applicable for Intermediate format)');
        const allEmployeesWithTemplates = employees.filter((emp) => emp.fingerprintTemplate && emp.fingerprintTemplate.length > 0);
        for (const employee of allEmployeesWithTemplates) {
            try {
                const matchResult = await this.fingerprintService.matchFingerprintsWithScore(normalizedInput, employee.fingerprintTemplate);
                this.logger.debug(`📊 ${employee.fullName}: ${matchResult.score.toFixed(2)}% ${matchResult.matched ? '✅' : '❌'}`);
                if (matchResult.matched && matchResult.score > highestScore) {
                    highestScore = matchResult.score;
                    bestMatch = employee;
                }
            }
            catch (error) {
                this.logger.error(`❌ Error matching ${employee.employeeId}:`, error);
            }
        }
        const duration = Date.now() - startTime;
        if (bestMatch) {
            this.logger.log(`✅ MATCH: ${bestMatch.fullName} - Score: ${highestScore.toFixed(2)}% - ${duration}ms`);
        }
        else {
            this.logger.warn(`❌ NO MATCH - ${duration}ms`);
        }
        return bestMatch;
    }
    async verifyFingerprintFromImage(imageBase64) {
        try {
            this.logger.log('🖼️ Extracting SourceAFIS template from verification image...');
            const matcherClient = this.fingerprintService['matcherClient'];
            if (!matcherClient) {
                this.logger.warn('⚠️ SourceAFIS matcher not available');
                return null;
            }
            const extractResult = await matcherClient.extractFromImage(imageBase64, 'png');
            if (!extractResult.success || !extractResult.template) {
                this.logger.warn(`⚠️ Failed to extract template: ${extractResult.message}`);
                return null;
            }
            this.logger.log(`✅ Extracted template: ${extractResult.minutiaeCount} minutiae`);
            return this.verifyFingerprintWithSourceAfis(extractResult.template);
        }
        catch (error) {
            this.logger.error('❌ Error verifying fingerprint from image:', error);
            return null;
        }
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = EmployeesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, common_1.Inject)(fingerprint_service_interface_1.IFingerprintService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        shifts_service_1.ShiftsService,
        departments_service_1.DepartmentsService,
        designations_service_1.DesignationsService,
        postings_service_1.PostingsService,
        fingerprint_service_interface_1.IFingerprintService,
        zkteco_service_1.ZKTecoService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map