export declare class CreatePostingDto {
    name: string;
    code: string;
    description?: string;
}
declare const UpdatePostingDto_base: import("@nestjs/common").Type<Partial<CreatePostingDto>>;
export declare class UpdatePostingDto extends UpdatePostingDto_base {
    isActive?: boolean;
}
export {};
