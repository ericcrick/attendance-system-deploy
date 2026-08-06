"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveStatus = exports.LeaveType = exports.UserRole = exports.EmploymentStatus = exports.AttendanceStatus = exports.AuthMethod = void 0;
var AuthMethod;
(function (AuthMethod) {
    AuthMethod["RFID"] = "RFID";
    AuthMethod["FINGERPRINT"] = "FINGERPRINT";
})(AuthMethod || (exports.AuthMethod = AuthMethod = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["ON_TIME"] = "ON_TIME";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EARLY_DEPARTURE"] = "EARLY_DEPARTURE";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["OVERTIME"] = "OVERTIME";
    AttendanceStatus["INCOMPLETE"] = "INCOMPLETE";
    AttendanceStatus["COMPLETED"] = "COMPLETED";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["ACTIVE"] = "ACTIVE";
    EmploymentStatus["INACTIVE"] = "INACTIVE";
    EmploymentStatus["SUSPENDED"] = "SUSPENDED";
    EmploymentStatus["TERMINATED"] = "TERMINATED";
})(EmploymentStatus || (exports.EmploymentStatus = EmploymentStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPERVISOR"] = "SUPERVISOR";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (exports.UserRole = UserRole = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL"] = "ANNUAL";
    LeaveType["SICK"] = "SICK";
    LeaveType["PERSONAL"] = "PERSONAL";
    LeaveType["MATERNITY"] = "MATERNITY";
    LeaveType["PATERNITY"] = "PATERNITY";
    LeaveType["UNPAID"] = "UNPAID";
    LeaveType["STUDY"] = "STUDY";
    LeaveType["PASS"] = "PASS";
    LeaveType["OTHER"] = "OTHER";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "PENDING";
    LeaveStatus["APPROVED"] = "APPROVED";
    LeaveStatus["REJECTED"] = "REJECTED";
    LeaveStatus["CANCELLED"] = "CANCELLED";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
//# sourceMappingURL=index.js.map