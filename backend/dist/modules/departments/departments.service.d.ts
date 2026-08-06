import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { Employee } from '../employees/entities/employee.entity';
export declare class DepartmentsService {
    private readonly departmentsRepository;
    private readonly employeesRepository;
    constructor(departmentsRepository: Repository<Department>, employeesRepository: Repository<Employee>);
    create(createDepartmentDto: CreateDepartmentDto): Promise<Department>;
    findAll(includeInactive?: boolean): Promise<Department[]>;
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department>;
    remove(id: string): Promise<void>;
    toggle(id: string): Promise<Department>;
    getStatistics(): Promise<any>;
    getEmployees(departmentId: string): Promise<any[]>;
}
