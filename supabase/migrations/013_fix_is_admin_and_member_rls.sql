-- Fix is_admin() to use auth_user_id instead of id
-- The original function checked `id = auth.uid()` but `id` is the member PK,
-- not the Supabase auth user ID. This caused admin checks to always fail and
-- the admin members list to return 0 rows.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM members
        WHERE auth_user_id = auth.uid()
          AND role IN ('national_officer', 'ihq_staff', 'super_admin')
    );
$$;

-- Fix members SELECT policy
DROP POLICY IF EXISTS "members_select_directory" ON members;
CREATE POLICY "members_select_directory"
    ON members FOR SELECT
    USING (
        show_in_directory = TRUE
        OR auth_user_id = auth.uid()
        OR public.is_admin()
    );

-- Fix members UPDATE policy
DROP POLICY IF EXISTS "members_update_own" ON members;
CREATE POLICY "members_update_own"
    ON members FOR UPDATE
    USING (auth_user_id = auth.uid() OR public.is_admin())
    WITH CHECK (auth_user_id = auth.uid() OR public.is_admin());

-- Fix members INSERT self policy
DROP POLICY IF EXISTS "members_insert_self" ON members;
CREATE POLICY "members_insert_self"
    ON members FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());
