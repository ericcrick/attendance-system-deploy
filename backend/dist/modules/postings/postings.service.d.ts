import { Repository } from 'typeorm';
import { Posting } from './entities/posting.entity';
import { CreatePostingDto, UpdatePostingDto } from './dto/posting.dto';
import { Employee } from '../employees/entities/employee.entity';
export declare class PostingsService {
    private readonly postingsRepository;
    private readonly employeesRepository;
    constructor(postingsRepository: Repository<Posting>, employeesRepository: Repository<Employee>);
    create(createPostingDto: CreatePostingDto): Promise<Posting>;
    findAll(includeInactive?: boolean): Promise<Posting[]>;
    findOne(id: string): Promise<Posting>;
    update(id: string, updatePostingDto: UpdatePostingDto): Promise<Posting>;
    remove(id: string): Promise<void>;
    toggle(id: string): Promise<Posting>;
    getStatistics(): Promise<any>;
}
