import {
  plainToInstance,
  Transform,
  TransformPlainToInstance,
  Type,
} from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
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
  @Matches(/^$|^(\+?\d{1,4})-(\d{10})$/, {
    message: "Phone number must be empty or in the format: +1234-1234567890",
  })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @ValidateNested()
  @Transform(({ value }) =>
    plainToInstance(AddressCreateDto, JSON.parse(value))
  )
  @Type(() => AddressCreateDto)
  address!: AddressCreateDto;

  @IsString({
    message: "Avatar is a necessary field",
  })
  avatar!: string;
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

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, {
    message: "Zip code must be 5 digits"
  })
  postalCode!: string;
}
