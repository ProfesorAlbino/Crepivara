import { Optional } from "@nestjs/common";

export class UserResponseDto {
    @Optional()
    admin_id: string;
    username: string;
    password: string;
    email: string;
    created_at: Date;
    last_login: Date;
}