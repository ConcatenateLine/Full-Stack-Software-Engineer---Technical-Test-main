import { Transform, Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";

export default class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#~^]{8,}$/, {
    message:
      "Password must be at least 8 characters long, including one uppercase letter, one digit, and no special characters except @$!%*?&#~^.",
  })
  password!: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @ValidateNested()
  @Type(() => AddressCreateDto)
  address!: AddressCreateDto;

  @IsString()
  @IsNotEmpty()
  profilePicture!: string;
}

export class AddressCreateDto {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value) || 0)
  postalCode?: number;
}
