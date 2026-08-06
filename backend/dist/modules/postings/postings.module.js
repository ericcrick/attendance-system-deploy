"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const posting_entity_1 = require("./entities/posting.entity");
const postings_controller_1 = require("./postings.controller");
const postings_service_1 = require("./postings.service");
const employee_entity_1 = require("../employees/entities/employee.entity");
let PostingsModule = class PostingsModule {
};
exports.PostingsModule = PostingsModule;
exports.PostingsModule = PostingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([posting_entity_1.Posting, employee_entity_1.Employee])],
        controllers: [postings_controller_1.PostingsController],
        providers: [postings_service_1.PostingsService],
        exports: [postings_service_1.PostingsService],
    })
], PostingsModule);
//# sourceMappingURL=postings.module.js.map