import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserEntity } from "src/core/entities/user.entity";

export abstract class UserRepositoryAbstract {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(id: string, user: UserEntity): Promise<UserEntity | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findByUsername(loginRequest: LoginRequestDto): Promise<UserEntity | null>;
}