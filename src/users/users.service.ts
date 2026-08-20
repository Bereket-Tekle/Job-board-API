import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository.js';
import { UserEntity, UserRole } from './entities/user.entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
  return this.usersRepository.findOne({ where: { id } });
  
}
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user)
  }

  async findAll(role?: UserRole) {
  if (role) {
    return this.usersRepository.find({ where: { role } });
  }
  return this.usersRepository.find();
}
}
