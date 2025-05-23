import { Body, Controller, Get, Post } from "@nestjs/common";
import { LoginRequestDto } from "src/application/dto/user/user-login-request.dto";
import { UserResponseDto } from "src/application/dto/user/user-response.dto";
import { UserUseCaseApplication } from "src/application/use-cases/user/user-use-case-application";

@Controller("users")
export class UserAdminController {
  constructor(private readonly userUseCaseApplication: UserUseCaseApplication) {}

  @Post("/login")
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<UserResponseDto> {
    return this.userUseCaseApplication.login(loginRequestDto);
  }

  @Post("/create")
  async createUser(@Body() user: UserResponseDto): Promise<UserResponseDto> {
    console.log("Creating user", user);
    return this.userUseCaseApplication.createUser(user);
  }

  @Post("/update")
  async updateUser(@Body() user: UserResponseDto): Promise<UserResponseDto> {
    console.log("Updating user", user);
    return this.userUseCaseApplication.updateUser(user);
  }
}
