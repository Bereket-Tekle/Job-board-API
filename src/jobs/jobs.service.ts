import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity/job.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateJobDto } from './dto/create-job.dto/create-job.dto';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { Company } from 'src/companies/entities/company.entity/company.entity';
import { FilterJobDto } from './dto/filter-job.dto/filter-job.dto';
import { UpdateJobDto } from './dto/update-job.dto/update-job.dto';
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,

    private companiesService: CompaniesService, // to verify ownership
  ) {}

  // CREATE — employer must own the company
  async create(dto: CreateJobDto, currentUser: UserEntity): Promise<Job> {
    // 1. find the company the employer wants to post under
    const company = await this.companiesService.findOne(dto.companyId);

    // 2. check the logged in user owns that company
    // this is the nested ownership check
    if (company.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        'You can only post jobs under your own company',
      );
    }

    // 3. create and save the job
    const job = this.jobsRepository.create({
      ...dto,
      companyId: company.id,
    });

    return this.jobsRepository.save(job);
  }

  // GET ALL — with optional filters
  async findAll(filters: FilterJobDto): Promise<{
    data: Job[];
    total: number;
    page: number;
    limit: number;
  }> {
    // QueryBuilder lets us build dynamic queries
    // based on which filters are provided
    const query = this.jobsRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company') // join company data
      .where('job.isActive = :isActive', { isActive: true }); // only active jobs

    // add filters only if they were provided
    if (filters.title) {
      query.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
        title: `%${filters.title}%`, // partial match, case insensitive
      });
    }

    if (filters.location) {
      query.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
        location: `%${filters.location}%`,
      });
    }

    if (filters.type) {
      query.andWhere('job.type = :type', { type: filters.type });
    }

    if (filters.minSalary) {
      query.andWhere('job.salaryMin >= :minSalary', {
        minSalary: filters.minSalary,
      });
    }

    if (filters.maxSalary) {
      query.andWhere('job.salaryMax <= :maxSalary', {
        maxSalary: filters.maxSalary,
      });
    }

    // pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query.orderBy('job.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  // GET ONE
  async findOne(id: number): Promise<Job> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException(`Job with id ${id} not found`);
    return job;
  }

  // UPDATE — must own the company the job belongs to
  async update(
    id: number,
    dto: UpdateJobDto,
    currentUser: UserEntity,
  ): Promise<Job> {
    const job = await this.findOne(id);

    // find the company to check ownership
    const company = await this.companiesService.findOne(job.companyId);

    if (company.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        'You can only update jobs under your own company',
      );
    }

    Object.assign(job, dto);
    return this.jobsRepository.save(job);
  }

  // DELETE — must own the company the job belongs to
  async remove(
    id: number,
    currentUser: UserEntity,
  ): Promise<{ message: string }> {
    const job = await this.findOne(id);

    const company = await this.companiesService.findOne(job.companyId);

    if (company.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        'You can only delete jobs under your own company',
      );
    }

    await this.jobsRepository.remove(job);
    return { message: `Job "${job.title}" deleted successfully` };
  }
}
