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
exports.PostingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const posting_entity_1 = require("./entities/posting.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let PostingsService = class PostingsService {
    postingsRepository;
    employeesRepository;
    constructor(postingsRepository, employeesRepository) {
        this.postingsRepository = postingsRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(createPostingDto) {
        const existingName = await this.postingsRepository.findOne({
            where: { name: createPostingDto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException(`Posting with name "${createPostingDto.name}" already exists`);
        }
        const existingCode = await this.postingsRepository.findOne({
            where: { code: createPostingDto.code },
        });
        if (existingCode) {
            throw new common_1.ConflictException(`Posting with code "${createPostingDto.code}" already exists`);
        }
        const posting = this.postingsRepository.create(createPostingDto);
        return this.postingsRepository.save(posting);
    }
    async findAll(includeInactive) {
        const whereCondition = includeInactive ? {} : { isActive: true };
        const postings = await this.postingsRepository.find({
            where: whereCondition,
            order: { name: 'ASC' },
        });
        if (!postings.length)
            return [];
        const counts = await this.employeesRepository
            .createQueryBuilder('employee')
            .select('employee.posting_id', 'postingId')
            .addSelect('COUNT(*)', 'count')
            .where('employee.status = :status', { status: 'ACTIVE' })
            .groupBy('employee.posting_id')
            .getRawMany();
        const countMap = new Map(counts.map((c) => [c.postingId, parseInt(c.count, 10)]));
        return postings.map((posting) => ({
            ...posting,
            employeeCount: countMap.get(posting.id) || 0,
        }));
    }
    async findOne(id) {
        const posting = await this.postingsRepository.findOne({
            where: { id },
        });
        if (!posting) {
            throw new common_1.NotFoundException(`Posting with ID "${id}" not found`);
        }
        const employeeCount = await this.postingsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.posting_id = :postingId', { postingId: posting.id })
            .getRawOne();
        return {
            ...posting,
            employeeCount: parseInt(employeeCount?.count || '0', 10),
        };
    }
    async update(id, updatePostingDto) {
        const posting = await this.findOne(id);
        if (updatePostingDto.name &&
            updatePostingDto.name !== posting.name) {
            const existingName = await this.postingsRepository.findOne({
                where: { name: updatePostingDto.name },
            });
            if (existingName) {
                throw new common_1.ConflictException(`Posting with name "${updatePostingDto.name}" already exists`);
            }
        }
        if (updatePostingDto.code &&
            updatePostingDto.code !== posting.code) {
            const existingCode = await this.postingsRepository.findOne({
                where: { code: updatePostingDto.code },
            });
            if (existingCode) {
                throw new common_1.ConflictException(`Posting with code "${updatePostingDto.code}" already exists`);
            }
        }
        Object.assign(posting, updatePostingDto);
        return this.postingsRepository.save(posting);
    }
    async remove(id) {
        const posting = await this.postingsRepository.findOne({
            where: { id },
        });
        if (!posting) {
            throw new common_1.NotFoundException(`Posting with ID "${id}" not found`);
        }
        const employeeCount = await this.postingsRepository
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('employees', 'employee')
            .where('employee.posting_id = :postingId', { postingId: id })
            .getRawOne();
        const count = parseInt(employeeCount?.count || '0', 10);
        if (count > 0) {
            throw new common_1.BadRequestException(`Cannot delete posting "${posting.name}" because it has ${count} assigned employee(s). Reassign employees first.`);
        }
        await this.postingsRepository.remove(posting);
    }
    async toggle(id) {
        const posting = await this.findOne(id);
        posting.isActive = !posting.isActive;
        return this.postingsRepository.save(posting);
    }
    async getStatistics() {
        const postings = await this.findAll(true);
        return {
            total: postings.length,
            active: postings.filter((p) => p.isActive).length,
            inactive: postings.filter((p) => !p.isActive).length,
        };
    }
};
exports.PostingsService = PostingsService;
exports.PostingsService = PostingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(posting_entity_1.Posting)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostingsService);
//# sourceMappingURL=postings.service.js.map