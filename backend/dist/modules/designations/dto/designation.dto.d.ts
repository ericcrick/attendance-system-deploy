export declare class CreateDesignationDto {
    name: string;
    code: string;
    description?: string;
}
declare const UpdateDesignationDto_base: import("@nestjs/common").Type<Partial<CreateDesignationDto>>;
export declare class UpdateDesignationDto extends UpdateDesignationDto_base {
    isActive?: boolean;
}
export {};
