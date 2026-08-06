import { DesignationsService } from './designations.service';
import { CreateDesignationDto, UpdateDesignationDto } from './dto/designation.dto';
import { Designation } from './entities/designation.entity';
export declare class DesignationsController {
    private readonly designationsService;
    constructor(designationsService: DesignationsService);
    create(createDesignationDto: CreateDesignationDto): Promise<Designation>;
    findAll(includeInactive?: boolean): Promise<Designation[]>;
    getStatistics(): Promise<any>;
    findOne(id: string): Promise<Designation>;
    update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation>;
    toggle(id: string): Promise<Designation>;
    remove(id: string): Promise<void>;
}
