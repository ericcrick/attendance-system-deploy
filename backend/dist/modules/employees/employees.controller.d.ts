import { EmployeesService, CreateEmployeeResult } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto, AssignRfidDto, AssignFingerprintDto } from './dto/create-employee.dto';
import { Employee } from './entities/employee.entity';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<CreateEmployeeResult>;
    findAll(includeInactive?: boolean, search?: string): Promise<Employee[]>;
    getStatistics(): Promise<{
        total: number;
        byStatus: {
            active: number;
            inactive: number;
            suspended: number;
            terminated: number;
        };
        byAuthMethod: {
            withRfid: number;
            withFingerprint: number;
        };
    }>;
    findMe(req: any): Promise<Employee>;
    findByDepartment(department: string): Promise<Employee[]>;
    findByShift(shiftId: string): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    deactivate(id: string): Promise<Employee>;
    activate(id: string): Promise<Employee>;
    assignRfidCard(id: string, assignRfidDto: AssignRfidDto): Promise<Employee>;
    removeRfidCard(id: string): Promise<Employee>;
    assignFingerprint(id: string, assignFingerprintDto: AssignFingerprintDto): Promise<Employee>;
    removeFingerprint(id: string): Promise<Employee>;
    remove(id: string): Promise<void>;
    uploadPhoto(id: string, file: Express.Multer.File): Promise<Employee>;
    removePhoto(id: string): Promise<Employee>;
    testFingerprintService(): Promise<any>;
    compareFingerprints(body: {
        template1: string;
        template2: string;
    }): Promise<{
        similarityScore: number;
        matched: boolean;
        threshold: number;
    }>;
}
