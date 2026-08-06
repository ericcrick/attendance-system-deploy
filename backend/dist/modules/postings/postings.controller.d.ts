import { PostingsService } from './postings.service';
import { CreatePostingDto, UpdatePostingDto } from './dto/posting.dto';
import { Posting } from './entities/posting.entity';
export declare class PostingsController {
    private readonly postingsService;
    constructor(postingsService: PostingsService);
    create(createPostingDto: CreatePostingDto): Promise<Posting>;
    findAll(includeInactive?: boolean): Promise<Posting[]>;
    getStatistics(): Promise<any>;
    findOne(id: string): Promise<Posting>;
    update(id: string, updatePostingDto: UpdatePostingDto): Promise<Posting>;
    toggle(id: string): Promise<Posting>;
    remove(id: string): Promise<void>;
}
