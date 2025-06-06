import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";

export abstract class UserServiceAbstract {
  abstract validateUser(username: string, password: string): Promise<any>;
  abstract createUser(user: any): Promise<any>;
  abstract getUserById(id: string): Promise<any>;
  abstract updateUser(user: UserResponseDto): Promise<UserResponseDto>;
  abstract deleteUser(id: string): Promise<any>;
  abstract login(loginRequest: LoginRequestDto): Promise<UserResponseDto>;
  abstract getAllUsers(): Promise<UserResponseDto[]>;
}