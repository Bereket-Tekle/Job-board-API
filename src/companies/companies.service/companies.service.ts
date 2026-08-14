import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Company } from '../entities/company.entity/company.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception.js';
import { CreateCompanyDto } from '../dto/create-company.dto/create-company.dto';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { UpdateCompanyDto } from '../dto/update-company.dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  //CREATE - employer only
  async create(dto: CreateCompanyDto, owner: UserEntity): Promise<Company> {
    //one employer can only own one company
    const existingCompany = await this.findByOwner(owner.id);
    if (existingCompany)
      throw new NotFoundException('You already own a company');

    const company = this.companiesRepository.create({
      ...dto,
      ownerId: owner.id,
    });
    return this.companiesRepository.save(company);
  }
  
  //GET all companies - public
  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      relations: { owner: true },
      select: {
        owner: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
  //GET one company - public
  async findOne(id: number): Promise<Company | null> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: { owner: true },
      select: {
        owner: { id: true, name: true, email: true },
      },
    });
    if (!company)
      throw new NotFoundException(`Company with id ${id} not found`);
    return company;
  }
  //GET  company by ownerId - used internally
  async findByOwner(ownerId: number): Promise<Company | null> {
    return this.companiesRepository.findOne({
      where: { ownerId },
    });
  }
  //UPDATE- employer only
  async update(
    id: number,
    dto: Partial<UpdateCompanyDto>,
    currentUser: UserEntity,
  ): Promise<Company> {
    const company = await this.findOne(id);
    if (!company) throw new NotFoundException('Company not Found');

    //only the owner of the company can update it
    if (company.ownerId !== currentUser.id)
      throw new ForbiddenException('You are not the owner of this company');

    Object.assign(company, dto);
    return this.companiesRepository.save(company);
  }

  //DELETE- owner only
  async remove(id: number, currentUser: UserEntity): Promise<{message: string}> {
    const company = await this.findOne(id);

    if (!company) throw new NotFoundException('Company not Found');

    if (company.ownerId !== currentUser.id)
      throw new ForbiddenException('You do not own this company');

    await this.companiesRepository.remove(company);
    return { message: `Company ${id} deleted` };
  }
}
