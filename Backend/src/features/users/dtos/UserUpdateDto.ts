import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

export default class UserUpdateDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  role?: string;

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
  postalCode?: number;
}
