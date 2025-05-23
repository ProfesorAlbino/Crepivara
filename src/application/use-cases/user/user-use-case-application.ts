import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";
import { UserServiceAbstract } from "src/core/interfaces/service/user/user-service-interface";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserUseCaseApplication{
    constructor(private readonly userService: UserServiceAbstract) {}

    async login(loginRequestDto: LoginRequestDto): Promise<UserResponseDto> {
        const user = await this.userService.login(loginRequestDto);

        if (!user) {
            throw new UnauthorizedException();
        }
        const isPasswordValid = await bcrypt.compare(loginRequestDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async createUser(user: UserResponseDto): Promise<UserResponseDto> {

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        return this.userService.createUser(user);
    }

    async updateUser(user: UserResponseDto): Promise<UserResponseDto> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        return this.userService.updateUser(user);
    }
}