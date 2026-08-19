import {
  Body,
  Controller,
  Post,
  UseGuards,
  Query,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { RolesGuard } from 'src/auth/guards/roles.guard/roles.guard';
import {
  UserEntity,
  UserRole,
} from 'src/users/entities/user.entity/user.entity';
import { CreateJobDto } from './dto/create-job.dto/create-job.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator/roles.decorator';
import { FilterJobDto } from './dto/filter-job.dto/filter-job.dto';
import { UpdateCompanyDto } from 'src/companies/dto/update-company.dto/update-company.dto';
import { UpdateJobDto } from './dto/update-job.dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobService: JobsService) {}
  // POST /api/jobs — employer only
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  create(@Body() dto: CreateJobDto, @CurrentUser() user: UserEntity) {
    return this.jobService.create(dto, user);
  }

  // GET /api/jobs — any logged in user, with filters
  @Get()
  findAll(@Query() filters: FilterJobDto) {
    // @Query() captures all ?key=value from the URL
    return this.jobService.findAll(filters);
  }

  // GET /api/jobs/:id — any logged in user
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }
  //PATCH /api/jobs/:id — employer who owns the company
  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.jobService.update(id, dto, user);
  }

  // DELETE /api/jobs/:id — employer who owns the company

  @Delete()
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.jobService.remove(id, user);
  }
}
