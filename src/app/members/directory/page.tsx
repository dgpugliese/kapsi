import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import DirectorySearch from '@/components/DirectorySearch';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Directory — Kappa Alpha Psi®',
};

export default async function DirectoryPage() {
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
    .select('id, name, designation')
    .order('name');

  const { data: provinces } = await supabase
    .from('provinces')
    .select('id, name')
    .order('name');

  return (
    <PortalShell title="Member Directory" activePage="directory" member={portalMember}>
      <DirectorySearch
        chapters={(chapters as any[]) ?? []}
        provinces={(provinces as any[]) ?? []}
      />
    </PortalShell>
  );
}
