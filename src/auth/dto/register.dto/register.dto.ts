import{IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from 'src/users/entities/user.entity/user.entity';
export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    email!: string

    @IsString()
    @MinLength(6)
    password!: string

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole

    

}
