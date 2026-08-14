import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto/create-company.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator/current-user.decorator';
import {
  UserEntity,
  UserRole,
} from 'src/users/entities/user.entity/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator/roles.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  //POST /api/companies - employer only
  @Post()
  @UseGuards()
  @Roles(UserRole.EMPLOYER)
  create(@Body() dto: CreateCompanyDto, @CurrentUser() user: UserEntity) {
    return this.companiesService.create(dto, user);
  }

  //GET /api/comapines - any logged in user
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  // GET /api/companies/:id - any logged in user
  @Get(':id')
  findOne(@Body('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  // PATCH /api/companies/:id — owner only (checked in service)
  @Patch(':id')
  @UseGuards()
  @Roles(UserRole.EMPLOYER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.companiesService.update(id, dto, user);
  }

  ///DELETE  /api/companies/:id — owner only (checked in service)
  @Delete(':id')
  @UseGuards()
  @Roles(UserRole.EMPLOYER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return (this, this.companiesService.remove(id, user));
  }
}
