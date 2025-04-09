import { ViewEntity, ViewColumn } from "typeorm";
import type { Address } from "../../common/valueObjects/Address";

//Static View not support dynamic parameters as Domain "process.env.Domain"
// "Expresion sql static"
//Can use as entity for querys
//Example :
//  /UserRepository.ts
//  async findAll(search, page, limit)Promise<FilterReturnType<UserWithAvatar>> {
//    const [items, total] = await AppDataSource.getRepository(
//      UserWithAvatar
//    ).findAndCount({
//      where: [
//          { email: ILike(`%${search}%`) },
//          { firstName: ILike(`%${search}%`) },
//          { lastName: ILike(`%${search}%`) }
//      ],
//      skip: (page - 1) * limit,
//      take: limit,
//      order: {
//      id: "ASC",
//      },
//    });
//    return { items, total: count };
//  }
@ViewEntity({
  expression: `
 SELECT
	"user"."id" AS "id",
	"user"."firstName" AS "firstName",
	"user"."lastName" AS "lastName",
	"user"."email" AS "email",
	"user"."phoneNumber" AS "phoneNumber",
	"user"."status" AS "status",
	"user"."address" AS "address",
	"user"."role" AS "role",
	CASE 
        WHEN "user"."avatar" IS NULL OR "user"."avatar" = '' THEN NULL
        ELSE CONCAT('http://localhost:8081/api', '/uploads/', "user"."avatar")
    END AS "avatar"
FROM
	"user"
    `,
})
export class UserWithAvatar {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  firstName!: string;

  @ViewColumn()
  lastName!: string;

  @ViewColumn()
  email!: string;

  @ViewColumn()
  phoneNumber!: string;

  @ViewColumn()
  status!: string;

  @ViewColumn()
  role!: string;

  @ViewColumn()
  avatar?: string;

  @ViewColumn()
  address?: Address;
}
