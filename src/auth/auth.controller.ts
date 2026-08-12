import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/register.dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('Login') 
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user:UserEntity) {
    return user
  }
}
