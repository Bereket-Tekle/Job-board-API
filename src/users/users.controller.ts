import { Controller,Get,Query } from '@nestjs/common';
import { UserRole } from './entities/user.entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
      constructor(private usersService: UsersService) {}

    @Get()
findAll(@Query('role') role?: UserRole) {
  return this.usersService.findAll(role);
}
}
