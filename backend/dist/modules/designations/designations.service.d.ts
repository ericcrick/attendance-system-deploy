import { Repository } from 'typeorm';
import { Designation } from './entities/designation.entity';
import { CreateDesignationDto, UpdateDesignationDto } from './dto/designation.dto';
import { Employee } from '../employees/entities/employee.entity';
export declare class DesignationsService {
    private readonly designationsRepository;
    private readonly employeesRepository;
    constructor(designationsRepository: Repository<Designation>, employeesRepository: Repository<Employee>);
    create(createDesignationDto: CreateDesignationDto): Promise<Designation>;
    findAll(includeInactive?: boolean): Promise<Designation[]>;
    findOne(id: string): Promise<Designation>;
    update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation>;
    remove(id: string): Promise<void>;
    toggle(id: string): Promise<Designation>;
    getStatistics(): Promise<any>;
}
