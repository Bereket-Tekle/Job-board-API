import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { Job } from './entities/job.entity/job.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Job]),
    CompaniesModule,  // gives access to CompaniesService for ownership check
    AuthModule        // gives access to JwtAuthGuard and RolesGuard
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService]

})
export class JobsModule {}
