import { Employee } from '../../employees/entities/employee.entity';
export declare class Shift {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    gracePeriodMinutes: number;
    description?: string;
    colorCode?: string;
    isActive: boolean;
    employees: Employee[];
    createdAt: Date;
    updatedAt: Date;
    isWithinShift(time?: Date): boolean;
    isLateArrival(arrivalTime: Date): boolean;
}
