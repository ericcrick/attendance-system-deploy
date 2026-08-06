export declare class CreateShiftDto {
    name: string;
    startTime: string;
    endTime: string;
    gracePeriodMinutes?: number;
    description?: string;
    colorCode?: string;
    isActive?: boolean;
}
export declare class UpdateShiftDto {
    name?: string;
    startTime?: string;
    endTime?: string;
    gracePeriodMinutes?: number;
    description?: string;
    colorCode?: string;
    isActive?: boolean;
}
