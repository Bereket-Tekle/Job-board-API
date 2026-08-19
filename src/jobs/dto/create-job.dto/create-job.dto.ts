import {
    IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { JobType } from 'src/jobs/entities/job.entity/job.entity';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description!: string;

  @IsEnum(JobType)
  type!: JobType;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsInt() // employer sends which company this job is for
  companyId!: number;
}
