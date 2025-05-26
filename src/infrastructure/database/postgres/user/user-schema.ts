import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from 'typeorm';

  @Entity('admin_users')
  export class AdminUserTypeORM{
    @PrimaryGeneratedColumn({ name: 'admin_id' })
    admin_id: string;

    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'password_hash' })
    password: string;

    @Column({ name: 'email' })
    email: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @Column({ name: 'last_login' })
    last_login: Date;
  }