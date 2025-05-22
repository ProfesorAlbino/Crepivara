import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";
import { UserServiceAbstract } from "src/core/interfaces/service/user/user-service-interface";

@Injectable()
export class UserUseCaseApplication{
    constructor(private readonly userService: UserServiceAbstract) {}

    async login(loginRequestDto: LoginRequestDto): Promise<UserResponseDto> {
        const user = await this.userService.login(loginRequestDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}