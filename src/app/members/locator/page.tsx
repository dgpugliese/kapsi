import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import LocatorFilter from '@/components/LocatorFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter Locator — Kappa Alpha Psi®',
};

export default async function LocatorPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: portalMember } = await supabase
    .from('members')
    .select('first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', user.id)
    .single();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*, province:province_id ( name )')
    .order('name');

  return (
    <PortalShell title="Chapter Locator" activePage="locator" member={portalMember}>
      <LocatorFilter chapters={(chapters as any[]) ?? []} />
    </PortalShell>
  );
}
