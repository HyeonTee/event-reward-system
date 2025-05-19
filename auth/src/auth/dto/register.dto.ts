import { IsString, IsIn } from 'class-validator';

export class RegisterDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsIn(['USER'])
    role: string;
}
