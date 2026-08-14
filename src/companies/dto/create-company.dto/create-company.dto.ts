import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsInt()
  @Min(1)
  size!: number;

  @IsOptional()
  @IsString()
  logo?: string;
}