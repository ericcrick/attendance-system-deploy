export declare class CreateDepartmentDto {
    name: string;
    code: string;
    description?: string;
    managerName?: string;
    managerEmail?: string;
}
declare const UpdateDepartmentDto_base: import("@nestjs/common").Type<Partial<CreateDepartmentDto>>;
export declare class UpdateDepartmentDto extends UpdateDepartmentDto_base {
    isActive?: boolean;
}
export {};
