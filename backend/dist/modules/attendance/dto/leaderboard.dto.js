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
exports.LeaderboardQueryDto = exports.TimePeriod = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TimePeriod;
(function (TimePeriod) {
    TimePeriod["WEEKLY"] = "WEEKLY";
    TimePeriod["MONTHLY"] = "MONTHLY";
    TimePeriod["YEARLY"] = "YEARLY";
    TimePeriod["CUSTOM"] = "CUSTOM";
})(TimePeriod || (exports.TimePeriod = TimePeriod = {}));
class LeaderboardQueryDto {
    period;
    startDate;
    endDate;
    department;
}
exports.LeaderboardQueryDto = LeaderboardQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TimePeriod, default: TimePeriod.MONTHLY }),
    (0, class_validator_1.IsEnum)(TimePeriod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaderboardQueryDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaderboardQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaderboardQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaderboardQueryDto.prototype, "department", void 0);
//# sourceMappingURL=leaderboard.dto.js.map