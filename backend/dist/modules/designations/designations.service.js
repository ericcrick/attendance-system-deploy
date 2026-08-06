"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const designation_entity_1 = require("./entities/designation.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let DesignationsService = class DesignationsService {
    designationsRepository;
    employeesRepository;
    constructor(designationsRepository, employeesRepository) {
        this.designationsRepository = designationsRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(createDesignationDto) {
        const existingName = await this.designationsRepository.findOne({
            where: { name: createDesignationDto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException(`Designation with name "${createDesignationDto.name}" already exists`);
        }
        const existingCode = await this.designationsRepository.findOne({
            where: { code: createDesignationDto.code },
        });
        if (existingCode) {
            throw new common_1.ConflictException(`Designation with code "${createDesignationDto.code}" already exists`);
        }
        const designation = this.designationsRepository.create(createDesignationDto);
        return this.designationsRepository.save(designation);
    }
    async findAll(includeInactive) {
        const whereCondition = includeInactive ? {} : { isActive: true };
        const designations = await this.designationsRepository.find({
            where: whereCondition,
            order: { name: 'ASC' },
        });
        if (!designations.length)
            return [];
        const counts = await this.employeesRepository
            .createQueryBuilder('employee')
            .select('employee.designation_id', 'designationId')
            .addSelect('COUNT(*)', 'count')
            .where('employee.status = :status', { status: 'ACTIVE' })
            .groupBy('employee.designation_id')
            .getRawMany();
        const countMap = new Map(counts.map((c) => [c.designationId, parseInt(c.count, 10)]));
        return designations.map((designation) => ({
            ...designation,
            employeeCount: countMap.get(designation.id) || 0,
        }));
    }
    async findOne(id) {
        const designation = await this.designationsRepository.findOne({
            where: { id },
        });
        if (!designation) {
            throw new common_1.NotFoundException(`Designation with ID "${id}" not found`);
        }
        const employeeCount = await this.designationsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.designation_id = :designationId', { designationId: designation.id })
            .getRawOne();
        return {
            ...designation,
            employeeCount: parseInt(employeeCount?.count || '0', 10),
        };
    }
    async update(id, updateDesignationDto) {
        const designation = await this.findOne(id);
        if (updateDesignationDto.name &&
            updateDesignationDto.name !== designation.name) {
            const existingName = await this.designationsRepository.findOne({
                where: { name: updateDesignationDto.name },
            });
            if (existingName) {
                throw new common_1.ConflictException(`Designation with name "${updateDesignationDto.name}" already exists`);
            }
        }
        if (updateDesignationDto.code &&
            updateDesignationDto.code !== designation.code) {
            const existingCode = await this.designationsRepository.findOne({
                where: { code: updateDesignationDto.code },
            });
            if (existingCode) {
                throw new common_1.ConflictException(`Designation with code "${updateDesignationDto.code}" already exists`);
            }
        }
        Object.assign(designation, updateDesignationDto);
        return this.designationsRepository.save(designation);
    }
    async remove(id) {
        const designation = await this.designationsRepository.findOne({
            where: { id },
        });
        if (!designation) {
            throw new common_1.NotFoundException(`Designation with ID "${id}" not found`);
        }
        const employeeCount = await this.designationsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.designation_id = :designationId', { designationId: id })
            .getRawOne();
        const count = parseInt(employeeCount?.count || '0', 10);
        if (count > 0) {
            throw new common_1.BadRequestException(`Cannot delete designation "${designation.name}" because it has ${count} assigned employee(s). Reassign employees first.`);
        }
        await this.designationsRepository.remove(designation);
    }
    async toggle(id) {
        const designation = await this.findOne(id);
        designation.isActive = !designation.isActive;
        return this.designationsRepository.save(designation);
    }
    async getStatistics() {
        const designations = await this.findAll(true);
        return {
            total: designations.length,
            active: designations.filter((d) => d.isActive).length,
            inactive: designations.filter((d) => !d.isActive).length,
        };
    }
};
exports.DesignationsService = DesignationsService;
exports.DesignationsService = DesignationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(designation_entity_1.Designation)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DesignationsService);
//# sourceMappingURL=designations.service.js.map