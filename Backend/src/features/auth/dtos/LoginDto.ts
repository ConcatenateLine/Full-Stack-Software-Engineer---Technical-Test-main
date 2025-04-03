import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export default class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
