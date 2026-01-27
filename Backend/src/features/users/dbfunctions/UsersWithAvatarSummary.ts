const UsersWithAvatarsSummary = `
    CREATE OR REPLACE FUNCTION get_users_with_avatar_summary(DOMAIN TEXT, SKIP INT, TAKE INT, STATUS_FILTER TEXT, ROLE_FILTER TEXT, SEARCH_FILTER TEXT)
    RETURNS BIGINT AS $$
    DECLARE
      "totalCount" BIGINT;
    BEGIN
      SELECT
        COUNT(*) INTO "totalCount"
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
            END;
      RETURN "totalCount";
    END;
    $$ LANGUAGE plpgsql;
`;

export default UsersWithAvatarsSummary;
