import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  MinLength,
  Matches,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export default class UserUpdateDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^$|^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must be empty or at least 8 characters long, including one uppercase letter, one digit, and no special characters except @$!%*?&.",
  })
  password?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @ValidateNested()
  @Type(() => AddressUpdateDto)
  @IsOptional()
  address?: AddressUpdateDto;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class AddressUpdateDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value) || 0)
  postalCode?: number;
}
