import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, AssignRfidDto, AssignFingerprintDto } from './dto/create-employee.dto';
import { ShiftsService } from '../shifts/shifts.service';
import { DepartmentsService } from '../departments/departments.service';
import { DesignationsService } from '../designations/designations.service';
import { PostingsService } from '../postings/postings.service';
import { ZKTecoService } from '../fingerprint/zkteco.service';
import { IFingerprintService } from '../fingerprint/fingerprint-service.interface';
import { User } from '../audit/entities/user.entity';
export interface NewEmployeeCredentials {
    username: string;
    temporaryPassword: string;
}
export interface CreateEmployeeResult {
    employee: Employee;
    credentials?: NewEmployeeCredentials;
}
export declare class EmployeesService {
    private readonly employeesRepository;
    private readonly usersRepository;
    private readonly shiftsService;
    private readonly departmentsService;
    private readonly designationsService;
    private readonly postingsService;
    private readonly fingerprintService;
    private readonly zkTecoService;
    private readonly logger;
    constructor(employeesRepository: Repository<Employee>, usersRepository: Repository<User>, shiftsService: ShiftsService, departmentsService: DepartmentsService, designationsService: DesignationsService, postingsService: PostingsService, fingerprintService: IFingerprintService, zkTecoService: ZKTecoService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<CreateEmployeeResult>;
    private createLoginForEmployee;
    findAll(includeInactive?: boolean, search?: string): Promise<Employee[]>;
    findByDepartment(department: string): Promise<Employee[]>;
    findByDepartmentId(departmentId: string): Promise<Employee[]>;
    findByShift(shiftId: string): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    findMe(employeeId?: string): Promise<Employee>;
    findByEmployeeId(employeeId: string): Promise<Employee>;
    findByRfidCard(rfidCardId: string): Promise<Employee | null>;
    findByFingerprintDeviceId(deviceId: string): Promise<Employee | null>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<Employee>;
    activate(id: string): Promise<Employee>;
    updatePhoto(id: string, photoUrl: string): Promise<Employee>;
    removePhoto(id: string): Promise<Employee>;
    private deletePhotoFile;
    assignRfidCard(id: string, assignRfidDto: AssignRfidDto): Promise<Employee>;
    removeRfidCard(id: string): Promise<Employee>;
    removeFingerprint(id: string): Promise<Employee>;
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
    testFingerprintService(): Promise<any>;
    getFingerprintDeviceInfo(): Promise<any>;
    testFingerprintDeviceConnection(): Promise<any>;
    syncAllFingerprintsToDevice(): Promise<any>;
    assignFingerprint(id: string, assignFingerprintDto: AssignFingerprintDto): Promise<Employee>;
    private verifyFingerprintWithSourceAfis;
    verifyFingerprint(fingerprintTemplate: string): Promise<Employee | null>;
    verifyFingerprintFromImage(imageBase64: string): Promise<Employee | null>;
}
