const UsersWithAvatarsSummary = `
    CREATE OR REPLACE FUNCTION get_users_with_avatar_summary(DOMAIN TEXT, SKIP INT, TAKE INT, STATUS_FILTER TEXT, ROLE_FILTER TEXT, SEARCH_FILTER TEXT)
    RETURNS BIGINT AS $$
    DECLARE
      "totalCount" BIGINT;
    BEGIN
      SELECT
        COUNT(*) INTO "totalCount"
      FROM "user"
      LEFT JOIN "role" ON "user"."roleId" = "role"."id"
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
              WHEN ROLE_FILTER IS NOT NULL THEN "role"."name" = ROLE_FILTER
              ELSE TRUE
            END;
      RETURN "totalCount";
    END;
    $$ LANGUAGE plpgsql;
`;

export default UsersWithAvatarsSummary;
