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
	"users"."id" AS "id",
	"users"."first_name" AS "firstName",
	"users"."last_name" AS "lastName",
	"users"."email" AS "email",
	"users"."phone_number" AS "phoneNumber",
	"users"."status" AS "status",
	"users"."address" AS "address",
	"roles"."name" AS "role",
	CASE 
        WHEN "users"."avatar" IS NULL OR "users"."avatar" = '' THEN NULL
        ELSE CONCAT('http://localhost:8181/api', '/uploads/', "users"."avatar")
    END AS "avatar"
FROM
	"users"
LEFT JOIN "roles" ON "users"."role_id" = "roles"."id"
    `,
})
export default class UserWithAvatar {
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
