import { ShiftsService } from './shifts.service';
import { CreateShiftDto, UpdateShiftDto } from './dto/create-shift.dto';
import { Shift } from './entities/shift.entity';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    create(createShiftDto: CreateShiftDto): Promise<Shift>;
    findAll(): Promise<Shift[]>;
    findActive(): Promise<Shift[]>;
    getCurrentShift(): Promise<Shift | null>;
    findOne(id: string): Promise<Shift>;
    update(id: string, updateShiftDto: UpdateShiftDto): Promise<Shift>;
    toggleActive(id: string): Promise<Shift>;
    remove(id: string): Promise<void>;
}
