-- Clean up roles: only 4 values + is_super_admin flag
-- Roles: candidate, member, vendor, ihq_staff
-- super_admin is a boolean flag toggled in Supabase dashboard only

ALTER TABLE members ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;

-- Migrate existing
UPDATE members SET is_super_admin = true WHERE role = 'super_admin';
UPDATE members SET is_staff = true WHERE role = 'ihq_staff';
UPDATE members SET role = 'member' WHERE role IN ('super_admin', 'national_officer', 'province_officer', 'chapter_officer');

-- Update is_admin() RLS function to use new role structure
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
          AND (is_super_admin = true OR role = 'ihq_staff')
    );
$$;
