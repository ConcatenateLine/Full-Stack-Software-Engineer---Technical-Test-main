import { IsNumber, Min, Max, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export default class UserPaginationDto {
  @IsNumber()
  @Min(0)
  total: number = 0;

  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsNumber()
  @Min(0)
  totalPages: number = 0;

  @IsBoolean()
  hasMore: boolean = false;
}
