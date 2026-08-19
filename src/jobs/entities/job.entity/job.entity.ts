import { Company } from 'src/companies/entities/company.entity/company.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  REMOTE = 'remote',
}
@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!:string
  
  @Column({type: 'text'})
  description!: string

  @Column ({
    type: 'enum',
    enum: JobType,
    default:JobType.FULL_TIME
  })
  type!:JobType

  @Column()
  location!:string

  @Column({type: 'int' , nullable:true})
  salaryMin!: number

  @Column({type:'int', nullable: true})
  salaryMax!: number

  @Column({type: 'simple-array', nullable: true})
  requirements!: string[]

  @Column({default: true})
  isActive!: boolean

  // relationship — many jobs belong to one company
  @ManyToOne(()=> Company, {eager: true})
  @JoinColumn({name:'companyId'})
   company!: Company;

 @Column()
 companyId!:number

 @CreateDateColumn()
 createdAt!:string

 @UpdateDateColumn()
 updatedAt!:string


}
