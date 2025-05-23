import { Injectable } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";
import { UserRepositoryAbstract } from "src/core/interfaces/repository/user/user-repository.interface";
import { UserServiceAbstract } from "src/core/interfaces/service/user/user-service-interface";

@Injectable()
export class UserService implements UserServiceAbstract {

    constructor(private readonly userRepository: UserRepositoryAbstract) {}
    
    async login(loginRequest: LoginRequestDto): Promise<UserResponseDto> {
        const userResponse = await this.userRepository.findByUsername(loginRequest);
        if (!userResponse) {
            throw new Error("Invalid credentials");
        }

        return userResponse;
    }
    
    validateUser(username: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    createUser(user: any): Promise<any> {
        return this.userRepository.create(user);
    }
    getUserById(id: string): Promise<any> {
        const user = this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async updateUser(user: UserResponseDto): Promise<UserResponseDto> {
        const updatedUser = await this.userRepository.update(user);
        return updatedUser;
    }

    deleteUser(id: string): Promise<any> {
        return this.userRepository.delete(id);
    }

}