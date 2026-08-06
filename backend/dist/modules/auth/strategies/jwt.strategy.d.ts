import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../audit/entities/user.entity';
export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersRepository;
    constructor(configService: ConfigService, usersRepository: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
