import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { Department } from './entities/department.entity';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<Department>;
    findAll(includeInactive?: boolean): Promise<Department[]>;
    getStatistics(): Promise<any>;
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department>;
    toggle(id: string): Promise<Department>;
    remove(id: string): Promise<void>;
}
