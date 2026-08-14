import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

import { Repository } from 'typeorm/browser/repository/Repository.js';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception.js';

import { UserEntity } from 'src/users/entities/user.entity/user.entity';

import { Company } from './entities/company.entity/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto/update-company.dto';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  //CREATE- employer only  (checked in controller via guard)
  async create(dto: CreateCompanyDto, owner: UserEntity): Promise<Company> {
    // check the name is unique
    const exists = await this.companiesRepository.findOne({
      where: { name: dto.name },
    });
    if (exists)
      throw new ConflictException('A Company with this name is already exists');

    const company = this.companiesRepository.create({
      ...dto,
      ownerId: owner.id, // attach the logged in user as owner
    });
    return this.companiesRepository.save(company);
  }

  // GET ALL — any logged in user
  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      order: { createdAt: 'DESC' }, // newest first
    });
  }
  // GET ONE — any logged in user
  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    return company;
  }
  // UPDATE — owner only
  async update(
    id: number,
    dto: UpdateCompanyDto,
    currentUser: UserEntity,
  ): Promise<Company> {
    const company = await this.findOne(id); // throws 404 if not found

    // check the logged in user owns this company
    if (company.ownerId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own company');
    }

    // if name is being changed, check it's still unique
    if (dto.name && dto.name !== company.name) {
      const exists = await this.companiesRepository.findOne({
        where: { name: dto.name },
      });
      if (exists) {
        throw new ConflictException('A company with this name already exists');
      }
    }

    Object.assign(company, dto);
    return this.companiesRepository.save(company);
  }
  // DELETE — owner only
  async remove(id: number, currentUser: UserEntity): Promise<{ message: string }> {
    const company = await this.findOne(id); // throws 404 if not found

    // check the logged in user owns this company
    if (company.ownerId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own company');
    }

    await this.companiesRepository.remove(company);
    return { message: `Company "${company.name}" deleted successfully` };
  }
}
