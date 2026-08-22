import { Application } from "express";
import { type } from "os";
import { Job } from "src/jobs/entities/job.entity/job.entity";
import { UserEntity } from "src/users/entities/user.entity/user.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ApplicationStatus {
    PENDING = 'pending',
    APP3ROVED = 'approved',
    REJECTED = 'rejected'
}
    
export class ApplicationEntity {

    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(() => UserEntity, {eager: true})
    @JoinColumn()
    seeker!: UserEntity

    @Column()
    seekerId!:number

    @ManyToOne(() => Job, {eager: true})
    @JoinColumn()
    job!:Job

    @Column()
    jobId!: number //foreign key -> jobId
    
    //STATUS
    // starts as pending, employer changes it to accepted or rejected
    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING
})
    status:ApplicationStatus

    @Column({type: 'text', nullable:true})
    coverLetter!:string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date 
}


