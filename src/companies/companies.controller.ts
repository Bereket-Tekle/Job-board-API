// src/companies/companies.controller.ts
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
import { UpdateCompanyDto } from './dto/update-company.dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator/current-user.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity/user.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard) //  protects ALL routes — must be logged in
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  // POST /api/companies — employer only
  @Post()
  @UseGuards(RolesGuard)        //  guards have actual values now
  @Roles(UserRole.EMPLOYER)
  create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.companiesService.create(dto, user);
  }

  // GET /api/companies — any logged in user
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  // GET /api/companies/:id — any logged in user
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { //  @Param not @Body
    return this.companiesService.findOne(id);
  }

  // PATCH /api/companies/:id — owner only
  @Patch(':id')
  @UseGuards(RolesGuard)        
  @Roles(UserRole.EMPLOYER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.companiesService.update(id, dto, user);
  }

  // DELETE /api/companies/:id — owner only
  @Delete(':id')
  @UseGuards(RolesGuard)        
  @Roles(UserRole.EMPLOYER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.companiesService.remove(id, user); 
  }
}