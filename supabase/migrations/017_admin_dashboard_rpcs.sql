-- RPC functions for admin dashboard to bypass Supabase row limit (1000 default)
-- These run server-side SQL to get accurate counts across 134k+ members

CREATE OR REPLACE FUNCTION public.admin_status_counts()
RETURNS TABLE(status text, cnt bigint)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT COALESCE(membership_status, 'unknown') as status, count(*) as cnt
    FROM members
    WHERE is_staff = false
    GROUP BY membership_status
    ORDER BY cnt DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_type_counts()
RETURNS TABLE(type text, cnt bigint)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT COALESCE(membership_type, 'unknown') as type, count(*) as cnt
    FROM members
    WHERE is_staff = false
    GROUP BY membership_type
    ORDER BY cnt DESC;
$$;
