import { IsOptional, IsString, IsEnum } from "class-validator";
import { UserRole, UserStatus } from "../../common/enums/UserEnums";

export default class UserFilterDto {
  @IsOptional()
  @IsString()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
