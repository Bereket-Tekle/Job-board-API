import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/register.dto/login.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        // 1 check  if  user with the same email already exists
        const exists = await this.usersService.findByEmail(dto.email);
        if(exists){
            throw new ConflictException('User with this email already exisits');
        }
        // 2 hash the password
        const hashedPassword = await bcrypt.hash(dto.password,10);

        // 3 create the user 
        const user = await this.usersService.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
        })
        // 4 return token
         return this.generateToken(user.id, user.email, user.role);
    }
    async login(dto: LoginDto) {
        // 1 find the user (with password)
        const user = await this.usersService.findByEmail(dto.email);
        if(!user) throw new UnauthorizedException('Invalid credentials');

        // 2 check the password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        // 3 return token
        return this.generateToken(user.id, user.email, user.role);
    }

    private generateToken(id: number, email: string, role: string){
        const payload = {sub: id, email, role};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id, email, role
            }
        }
    }
}
