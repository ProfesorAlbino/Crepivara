import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
    return this.userUseCaseApplication.createUser(user);
  }

  @Post("/update")
  async updateUser(@Body() user: UserResponseDto): Promise<UserResponseDto> {
    return this.userUseCaseApplication.updateUser(user);
  }

  @Post("/delete/:id")
  async deleteUser(@Param("id") id: string): Promise<UserResponseDto> {
    return this.userUseCaseApplication.deleteUser(id);
  }

  @Get("/get/:id")
  async getUserById(@Param("id") id: string): Promise<UserResponseDto> {
    return this.userUseCaseApplication.getUserById(id);
  }

  @Get("/all")
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userUseCaseApplication.getAllUsers();
  }
}
