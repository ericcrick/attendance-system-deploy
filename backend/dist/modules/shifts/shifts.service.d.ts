import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto, UpdateShiftDto } from './dto/create-shift.dto';
export declare class ShiftsService {
    private readonly shiftsRepository;
    constructor(shiftsRepository: Repository<Shift>);
    create(createShiftDto: CreateShiftDto): Promise<Shift>;
    findAll(): Promise<Shift[]>;
    findActive(): Promise<Shift[]>;
    findOne(id: string): Promise<Shift>;
    update(id: string, updateShiftDto: UpdateShiftDto): Promise<Shift>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<Shift>;
    getCurrentShift(): Promise<Shift | null>;
    private validateShiftTimes;
    private timeToMinutes;
}
