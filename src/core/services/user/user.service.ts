import { Injectable } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";
import { UserServiceAbstract } from "src/core/interfaces/service/user/user-service-interface";

@Injectable()
export class UserService implements UserServiceAbstract {
    login(loginRequest: LoginRequestDto): Promise<UserResponseDto> {
        throw new Error("Method not implemented.");
    }
    
    validateUser(username: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    createUser(user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateUser(id: string, user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}