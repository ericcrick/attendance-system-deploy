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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shift_entity_1 = require("./entities/shift.entity");
let ShiftsService = class ShiftsService {
    shiftsRepository;
    constructor(shiftsRepository) {
        this.shiftsRepository = shiftsRepository;
    }
    async create(createShiftDto) {
        const existingShift = await this.shiftsRepository.findOne({
            where: { name: createShiftDto.name },
        });
        if (existingShift) {
            throw new common_1.ConflictException(`Shift with name "${createShiftDto.name}" already exists`);
        }
        this.validateShiftTimes(createShiftDto.startTime, createShiftDto.endTime);
        const shift = this.shiftsRepository.create({
            ...createShiftDto,
            gracePeriodMinutes: createShiftDto.gracePeriodMinutes ?? 15,
        });
        return this.shiftsRepository.save(shift);
    }
    async findAll() {
        return this.shiftsRepository.find({
            order: { startTime: 'ASC' },
        });
    }
    async findActive() {
        return this.shiftsRepository.find({
            where: { isActive: true },
            order: { startTime: 'ASC' },
        });
    }
    async findOne(id) {
        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['employees'],
        });
        if (!shift) {
            throw new common_1.NotFoundException(`Shift with ID "${id}" not found`);
        }
        return shift;
    }
    async update(id, updateShiftDto) {
        const shift = await this.findOne(id);
        if (updateShiftDto.startTime || updateShiftDto.endTime) {
            const startTime = updateShiftDto.startTime || shift.startTime;
            const endTime = updateShiftDto.endTime || shift.endTime;
            this.validateShiftTimes(startTime, endTime);
        }
        if (updateShiftDto.name && updateShiftDto.name !== shift.name) {
            const existingShift = await this.shiftsRepository.findOne({
                where: { name: updateShiftDto.name },
            });
            if (existingShift) {
                throw new common_1.ConflictException(`Shift with name "${updateShiftDto.name}" already exists`);
            }
        }
        Object.assign(shift, updateShiftDto);
        return this.shiftsRepository.save(shift);
    }
    async remove(id) {
        const shift = await this.findOne(id);
        if (shift.employees && shift.employees.length > 0) {
            throw new common_1.BadRequestException(`Cannot delete shift "${shift.name}" because it has ${shift.employees.length} assigned employee(s). Reassign employees first.`);
        }
        await this.shiftsRepository.remove(shift);
    }
    async toggleActive(id) {
        const shift = await this.findOne(id);
        shift.isActive = !shift.isActive;
        return this.shiftsRepository.save(shift);
    }
    async getCurrentShift() {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const shifts = await this.findActive();
        for (const shift of shifts) {
            if (currentTime >= shift.startTime && currentTime <= shift.endTime) {
                return shift;
            }
        }
        return null;
    }
    validateShiftTimes(startTime, endTime) {
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        let durationMinutes;
        if (end < start) {
            durationMinutes = (24 * 60 - start) + end;
        }
        else if (end === start) {
            throw new common_1.BadRequestException('Shift start and end times cannot be the same');
        }
        else {
            durationMinutes = end - start;
        }
        const minDurationMinutes = 240;
        if (durationMinutes < minDurationMinutes) {
            throw new common_1.BadRequestException('Shift duration must be at least 4 hours');
        }
        const maxDurationMinutes = 720;
        if (durationMinutes > maxDurationMinutes) {
            throw new common_1.BadRequestException('Shift duration cannot exceed 12 hours');
        }
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map