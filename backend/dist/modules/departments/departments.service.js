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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("./entities/department.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let DepartmentsService = class DepartmentsService {
    departmentsRepository;
    employeesRepository;
    constructor(departmentsRepository, employeesRepository) {
        this.departmentsRepository = departmentsRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(createDepartmentDto) {
        const existingName = await this.departmentsRepository.findOne({
            where: { name: createDepartmentDto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException(`Department with name "${createDepartmentDto.name}" already exists`);
        }
        const existingCode = await this.departmentsRepository.findOne({
            where: { code: createDepartmentDto.code },
        });
        if (existingCode) {
            throw new common_1.ConflictException(`Department with code "${createDepartmentDto.code}" already exists`);
        }
        const department = this.departmentsRepository.create(createDepartmentDto);
        return this.departmentsRepository.save(department);
    }
    async findAll(includeInactive) {
        const whereCondition = includeInactive ? {} : { isActive: true };
        const departments = await this.departmentsRepository.find({
            where: whereCondition,
            order: { name: 'ASC' },
        });
        if (!departments.length)
            return [];
        const counts = await this.employeesRepository
            .createQueryBuilder('employee')
            .select('employee.department_id', 'departmentId')
            .addSelect('COUNT(*)', 'count')
            .where('employee.status = :status', { status: 'ACTIVE' })
            .groupBy('employee.department_id')
            .getRawMany();
        const countMap = new Map(counts.map((c) => [c.departmentId, parseInt(c.count, 10)]));
        return departments.map((dept) => ({
            ...dept,
            employeeCount: countMap.get(dept.id) || 0,
        }));
    }
    async findOne(id) {
        const department = await this.departmentsRepository.findOne({
            where: { id },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID "${id}" not found`);
        }
        const employeeCount = await this.departmentsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.department_id = :deptId', { deptId: department.id })
            .getRawOne();
        return {
            ...department,
            employeeCount: parseInt(employeeCount?.count || '0', 10),
        };
    }
    async update(id, updateDepartmentDto) {
        const department = await this.findOne(id);
        if (updateDepartmentDto.name &&
            updateDepartmentDto.name !== department.name) {
            const existingName = await this.departmentsRepository.findOne({
                where: { name: updateDepartmentDto.name },
            });
            if (existingName) {
                throw new common_1.ConflictException(`Department with name "${updateDepartmentDto.name}" already exists`);
            }
        }
        if (updateDepartmentDto.code &&
            updateDepartmentDto.code !== department.code) {
            const existingCode = await this.departmentsRepository.findOne({
                where: { code: updateDepartmentDto.code },
            });
            if (existingCode) {
                throw new common_1.ConflictException(`Department with code "${updateDepartmentDto.code}" already exists`);
            }
        }
        Object.assign(department, updateDepartmentDto);
        return this.departmentsRepository.save(department);
    }
    async remove(id) {
        const department = await this.departmentsRepository.findOne({
            where: { id },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID "${id}" not found`);
        }
        const employeeCount = await this.departmentsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.department_id = :deptId', { deptId: id })
            .getRawOne();
        const count = parseInt(employeeCount?.count || '0', 10);
        if (count > 0) {
            throw new common_1.BadRequestException(`Cannot delete department "${department.name}" because it has ${count} assigned employee(s). Reassign employees first.`);
        }
        await this.departmentsRepository.remove(department);
    }
    async toggle(id) {
        const department = await this.findOne(id);
        department.isActive = !department.isActive;
        return this.departmentsRepository.save(department);
    }
    async getStatistics() {
        const departments = await this.findAll(true);
        return {
            total: departments.length,
            active: departments.filter((d) => d.isActive).length,
            inactive: departments.filter((d) => !d.isActive).length,
        };
    }
    async getEmployees(departmentId) {
        const department = await this.findOne(departmentId);
        const employees = await this.departmentsRepository
            .createQueryBuilder()
            .select('employee.*')
            .from('employees', 'employee')
            .where('employee.department_id = :deptId', { deptId: departmentId })
            .getRawMany();
        return employees;
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map