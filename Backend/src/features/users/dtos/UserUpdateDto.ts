import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  Matches,
} from "class-validator";
import { plainToInstance, Transform, Type } from "class-transformer";
import { AddressCreateDto } from "./UserCreateDto";

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
  @Matches(/^$|^(\+?\d{1,4})-(\d{10})$/, {
    message: "Phone number must be empty or in the format: +1234-1234567890",
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @ValidateNested()
  @IsOptional()
  @Transform(({ value }) =>
    plainToInstance(AddressCreateDto, JSON.parse(value))
  )
  @Type(() => AddressCreateDto)
  address?: AddressUpdateDto;

  @IsString()
  @IsOptional()
  avatar?: string;
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

  @IsString()
  @IsOptional()
  @Matches(/^\d{5}$/, {
    message: "Zip code must be 5 digits",
  })
  postalCode?: string;
}
