// this DTO captures the query parameters for filtering
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JobType } from 'src/jobs/entities/job.entity/job.entity';


export class FilterJobDto {
  @IsOptional()
  @IsString()
  title?: string;       // ?title=react

  @IsOptional()
  @IsString()
  location?: string;    // ?location=addis

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;       // ?type=remote

  @IsOptional()
  @Type(() => Number)   // converts "50000" string → 50000 number
  @IsInt()
  @Min(0)
  minSalary?: number;   // ?minSalary=50000

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxSalary?: number;   // ?maxSalary=100000

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;    // ?page=2

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;  // ?limit=10
}