const UsersWithAvatars = `
    CREATE OR REPLACE FUNCTION get_users_with_avatar(DOMAIN TEXT, SKIP INT, TAKE INT, STATUS_FILTER TEXT, ROLE_FILTER TEXT, SEARCH_FILTER TEXT)
    RETURNS TABLE(
      "id" INT,
      "firstName" VARCHAR,
      "lastName" VARCHAR,
      "email" VARCHAR,
      "phoneNumber" VARCHAR,
      "status" VARCHAR,
      "role" VARCHAR,
      "address" JSONB,
      "avatar" TEXT
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        "users"."id",
        "users"."first_name" AS "firstName",
        "users"."last_name" AS "lastName",
        "users"."email",
        "users"."phone_number" AS "phoneNumber",
        "users"."status",
        "roles"."name" AS "role",
        "users"."address",
        CASE 
          WHEN "users"."avatar" IS NULL OR "users"."avatar" = '' THEN DOMAIN || '/assets/placeholders/avatarPlaceHolder.webp'
          ELSE CONCAT(DOMAIN, '/uploads/', "users"."avatar")
        END AS "avatar"
      FROM "users"
      LEFT JOIN "roles" ON "users"."role_id" = "roles"."id"
        WHERE
            CASE
                WHEN SEARCH_FILTER IS NOT NULL THEN "users"."first_name" ILIKE '%' || SEARCH_FILTER || '%' OR "users"."last_name" ILIKE '%' || SEARCH_FILTER || '%' OR "users"."email" ILIKE '%' || SEARCH_FILTER || '%'
                ELSE TRUE
            END
        AND
            CASE
              WHEN STATUS_FILTER IS NOT NULL THEN "users"."status" = STATUS_FILTER
              ELSE TRUE
            END
        AND
            CASE
              WHEN ROLE_FILTER IS NOT NULL THEN "roles"."name" = ROLE_FILTER
              ELSE TRUE
            END
        ORDER BY "users"."id" ASC
        LIMIT
            TAKE
        OFFSET
            SKIP;
    END;
    $$ LANGUAGE plpgsql;
  `;

export default UsersWithAvatars;
