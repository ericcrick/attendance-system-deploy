"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
const attendance_entity_1 = require("../../attendance/entities/attendance.entity");
const department_entity_1 = require("../../departments/entities/department.entity");
const designation_entity_1 = require("../../designations/entities/designation.entity");
const posting_entity_1 = require("../../postings/entities/posting.entity");
const leave_entity_1 = require("../../leaves/entities/leave.entity");
const class_transformer_1 = require("class-transformer");
let Employee = class Employee {
    id;
    employeeId;
    firstName;
    lastName;
    middleName;
    email;
    phone;
    department;
    departmentId;
    departmentRelation;
    leaves;
    position;
    designationId;
    designation;
    postingId;
    posting;
    rfidCardId;
    fingerprintTemplate;
    fingerprintImage;
    fingerprintSourceAfisTemplate;
    fingerprintHash;
    fingerprintDeviceId;
    disabledAuthMethods;
    photoUrl;
    status;
    shiftId;
    shift;
    attendances;
    dateJoined;
    yearOfEnlistment;
    notes;
    createdAt;
    updatedAt;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.Employee = Employee;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID number', example: 'EMP-001' }),
    (0, typeorm_1.Column)({ unique: true, name: 'employee_id' }),
    __metadata("design:type", String)
], Employee.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    (0, typeorm_1.Column)({ name: 'first_name' }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    (0, typeorm_1.Column)({ name: 'last_name' }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Middle name', example: 'Kwame', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'middle_name' }),
    __metadata("design:type", String)
], Employee.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'john.doe@military.com', required: false }),
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+1234567890', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name (legacy field)', example: 'Operations' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID (new field)', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'department_id' }),
    __metadata("design:type", String)
], Employee.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department details', type: () => department_entity_1.Department, required: false }),
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], Employee.prototype, "departmentRelation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Leave records', type: () => [leave_entity_1.Leave] }),
    (0, typeorm_1.OneToMany)(() => leave_entity_1.Leave, (leave) => leave.employee),
    __metadata("design:type", Array)
], Employee.prototype, "leaves", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job position (legacy free-text field)', example: 'Security Officer', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Designation ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'designation_id' }),
    __metadata("design:type", String)
], Employee.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Designation details', type: () => designation_entity_1.Designation, required: false }),
    (0, typeorm_1.ManyToOne)(() => designation_entity_1.Designation, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'designation_id' }),
    __metadata("design:type", designation_entity_1.Designation)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'posting_id' }),
    __metadata("design:type", String)
], Employee.prototype, "postingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posting details', type: () => posting_entity_1.Posting, required: false }),
    (0, typeorm_1.ManyToOne)(() => posting_entity_1.Posting, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'posting_id' }),
    __metadata("design:type", posting_entity_1.Posting)
], Employee.prototype, "posting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'RFID card identifier', required: false }),
    (0, typeorm_1.Column)({ unique: true, nullable: true, name: 'rfid_card_id' }),
    __metadata("design:type", String)
], Employee.prototype, "rfidCardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fingerprint template data (Base64 encoded)', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'fingerprint_template' }),
    __metadata("design:type", String)
], Employee.prototype, "fingerprintTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Raw fingerprint image (Base64 PNG) for SourceAFIS', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'fingerprint_image' }),
    __metadata("design:type", String)
], Employee.prototype, "fingerprintImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SourceAFIS extracted template', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'fingerprint_sourceafis_template' }),
    __metadata("design:type", String)
], Employee.prototype, "fingerprintSourceAfisTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fingerprint template hash for quick duplicate detection', required: false }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true, name: 'fingerprint_hash' }),
    __metadata("design:type", String)
], Employee.prototype, "fingerprintHash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fingerprint device user ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'fingerprint_device_id' }),
    __metadata("design:type", String)
], Employee.prototype, "fingerprintDeviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auth methods disabled for clock-in/out on this employee, even if a credential is enrolled',
        enum: enums_1.AuthMethod,
        isArray: true,
        required: false,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.AuthMethod,
        array: true,
        default: '{}',
        name: 'disabled_auth_methods',
    }),
    __metadata("design:type", Array)
], Employee.prototype, "disabledAuthMethods", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profile photo URL', required: false }),
    (0, typeorm_1.Column)({ nullable: true, name: 'photo_url' }),
    __metadata("design:type", String)
], Employee.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment status', enum: enums_1.EmploymentStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.EmploymentStatus,
        default: enums_1.EmploymentStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned shift ID' }),
    (0, typeorm_1.Column)({ name: 'shift_id' }),
    __metadata("design:type", String)
], Employee.prototype, "shiftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shift details', type: () => shift_entity_1.Shift }),
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift, (shift) => shift.employees, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'shift_id' }),
    __metadata("design:type", shift_entity_1.Shift)
], Employee.prototype, "shift", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attendance records', type: () => [attendance_entity_1.Attendance] }),
    (0, typeorm_1.OneToMany)(() => attendance_entity_1.Attendance, (attendance) => attendance.employee),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date joined', example: '2024-01-01T00:00:00Z' }),
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'date_joined', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Employee.prototype, "dateJoined", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Year of enlistment', example: 2015, required: false }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'year_of_enlistment' }),
    __metadata("design:type", Number)
], Employee.prototype, "yearOfEnlistment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Employee.prototype, "fullName", null);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employees')
], Employee);
//# sourceMappingURL=employee.entity.js.map