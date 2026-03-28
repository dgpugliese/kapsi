-- Allow admins to view ALL EIC submissions (risk management dashboard)
CREATE POLICY "Admins can view all EICs"
    ON eic_submissions FOR SELECT
    USING (public.is_admin());

-- Allow admins to update ALL EIC submissions (approve/decline)
CREATE POLICY "Admins can update all EICs"
    ON eic_submissions FOR UPDATE
    USING (public.is_admin());
