import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/core/entities/user.entity";
import { UserRepositoryAbstract } from "src/core/interfaces/repository/user/user-repository.interface";
import { AdminUserTypeORM } from "./user-schema";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";

@Injectable()
export class UserRepository extends UserRepositoryAbstract {

    constructor(
        @InjectRepository(AdminUserTypeORM)
        private readonly adminUserRepository: Repository<AdminUserTypeORM>,
    ) {
        super();
    }

    async findByUsername(loginRequest: LoginRequestDto): Promise<UserEntity | null> {
        const user = await this.adminUserRepository.findOne({
            where: {
                username: loginRequest.username,
            },
        });
        return user;
    }

  async findById(id: string): Promise<UserEntity | null> {
    const model = await this.adminUserRepository.findOne({ where: { admin_id: id } });
    if (!model) return null;
    return model;
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.adminUserRepository.find();
    return models;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const saved = await this.adminUserRepository.save(user);
    return saved;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const existing = await this.adminUserRepository.findOne({ where: { admin_id: user.admin_id } });
    if (!existing) {
      throw new Error(`User with id ${user.admin_id} not found`);
    }

    // Mezcla los cambios
    const updatedModel = this.adminUserRepository.merge(existing, {
      username:   user.username,
      password:   user.password,
      email:      user.email,
      created_at: user.created_at,
      last_login: user.last_login,
    });

    const saved = await this.adminUserRepository.save(updatedModel);
    return saved;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.adminUserRepository.delete({ admin_id: id });
    return typeof result.affected === "number" && result.affected > 0;
  }
}