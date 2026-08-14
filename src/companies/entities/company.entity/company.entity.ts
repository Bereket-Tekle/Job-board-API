import {
  Entity,  
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity/user.entity';

@Entity('companies')

export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  website!: string;

  @Column()
  location!: string;

  @Column()
  industry!: string;

  @Column({ type: 'int' })
  size!: number;

  @Column({ nullable: true })
  logo!: string;

  // one employer own this company
  @ManyToMany(()=> UserEntity, {eager: true})
  @JoinColumn({name: 'ownerId'})
  owner!: UserEntity;

  @Column()
  ownerId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
