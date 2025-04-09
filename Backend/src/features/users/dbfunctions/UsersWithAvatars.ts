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
      "address" JSON,
      "avatar" TEXT
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        "user"."id",
        "user"."firstName",
        "user"."lastName",
        "user"."email",
        "user"."phoneNumber",
        "user"."status",
        "user"."role",
        "user"."address",
        CASE 
          WHEN "user"."avatar" IS NULL OR "user"."avatar" = '' THEN DOMAIN || '/assets/placeholders/imagePlaceHolder.svg'
          ELSE CONCAT(DOMAIN, '/uploads/', "user"."avatar")
        END AS "avatar"
      FROM "user"
        WHERE
            CASE
                WHEN SEARCH_FILTER IS NOT NULL THEN "user"."firstName" ILIKE '%' || SEARCH_FILTER || '%' OR "user"."lastName" ILIKE '%' || SEARCH_FILTER || '%' OR "user"."email" ILIKE '%' || SEARCH_FILTER || '%'
                ELSE TRUE
            END
        AND
            CASE
              WHEN STATUS_FILTER IS NOT NULL THEN "user"."status" = STATUS_FILTER
              ELSE TRUE
            END
        AND
            CASE
              WHEN ROLE_FILTER IS NOT NULL THEN "user"."role" = ROLE_FILTER
              ELSE TRUE
            END
        ORDER BY "user"."id" ASC
        LIMIT
            TAKE
        OFFSET
            SKIP;
    END;
    $$ LANGUAGE plpgsql;
  `;

export default UsersWithAvatars;
