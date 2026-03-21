import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import PortalShell from '@/components/PortalShell';
import StoreGrid from '@/components/StoreGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kappa Store — Kappa Alpha Psi®',
};

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'pins', label: 'Pins & Badges' },
  { id: 'life', label: 'Life Membership' },
  { id: 'apparel', label: 'Apparel & Accessories' },
  { id: 'books', label: 'Books & Publications' },
];

const products = [
  // Life Membership
  { name: 'Life Membership Pin', price: 85, image: '/images/store/life-pin.jpg', category: 'life', badge: '' },
  { name: 'Diamond Life Membership Pin', price: 195, image: '/images/store/diamond-life-pin.jpg', category: 'life', badge: 'Popular' },
  { name: 'Life Membership Jacket', price: 250, image: '/images/store/life-jacket.jpg', category: 'life', badge: '' },
  { name: 'Diamond Life Membership Jacket', price: 375, image: '/images/store/diamond-life-jacket.jpg', category: 'life', badge: 'Premium' },
  { name: 'Life Membership Plaque', price: 150, image: '/images/store/life-plaque.jpg', category: 'life', badge: '' },

  // Anniversary Pins
  { name: '25 Year Pin', price: 45, image: '/images/store/25-year-pin.jpg', category: 'pins', badge: '' },
  { name: '50 Year Gold Pin (No Diamonds)', price: 65, image: '/images/store/50-year-gold-pin.jpg', category: 'pins', badge: '' },
  { name: '50 Year Gold Pin with Diamonds', price: 135, image: '/images/store/50-year-gold-diamond-pin.jpg', category: 'pins', badge: '' },
  { name: '50 Year Red Pin', price: 55, image: '/images/store/50-year-red-pin.jpg', category: 'pins', badge: '' },
  { name: '75 Year Pin with Jewels', price: 175, image: '/images/store/75-year-pin-jewels.jpg', category: 'pins', badge: '' },
  { name: '75 Year Pin (No Jewels)', price: 95, image: '/images/store/75-year-pin-plain.jpg', category: 'pins', badge: '' },

  // Chapter Polemarch Badges
  { name: 'Polemarch Badge \u2014 10K Gold, Diamonds', price: 425, image: '/images/store/polemarch-badge-10k-diamond.jpg', category: 'pins', badge: 'Premium' },
  { name: 'Polemarch Badge \u2014 10K Gold, Synthetic', price: 275, image: '/images/store/polemarch-badge-10k-synthetic.jpg', category: 'pins', badge: '' },
  { name: 'Polemarch Badge \u2014 Gold Plated, Diamonds', price: 225, image: '/images/store/polemarch-badge-gold-plated-diamond.jpg', category: 'pins', badge: '' },
  { name: 'Polemarch Badge \u2014 Gold Plated, Synthetic', price: 145, image: '/images/store/polemarch-badge-gold-plated-synthetic.jpg', category: 'pins', badge: '' },

  // Sweetheart Pins
  { name: 'Crown Pearl Sweetheart Pin', price: 75, image: '/images/store/crown-pearl-sweetheart-pin.jpg', category: 'pins', badge: '' },
  { name: 'Plain Sweetheart Pin', price: 45, image: '/images/store/plain-sweetheart-pin.jpg', category: 'pins', badge: '' },

  // Number Badges & Insignia
  { name: '#1 Badge', price: 35, image: '/images/store/number-1-badge.jpg', category: 'pins', badge: '' },
  { name: '#3 Badge', price: 35, image: '/images/store/number-3-badge.jpg', category: 'pins', badge: '' },
  { name: 'Officer Insignia', price: 55, image: '/images/store/officer-insignia.jpg', category: 'pins', badge: '' },

  // Apparel & Accessories
  { name: 'Kappa Alpha Psi\u00AE Bag', price: 65, image: '/images/store/kap-bag.jpg', category: 'apparel', badge: '' },

  // Books
  { name: 'The Story of Kappa Alpha Psi \u2014 6th Edition', price: 60, image: '/images/store/story-of-kap.jpg', category: 'books', badge: 'New Edition' },
  { name: 'Protocol & Etiquette Manual', price: 25, image: '/images/store/protocol-manual.jpg', category: 'books', badge: '' },
];

export default async function StorePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/member-login');

  const { data: portalMember } = await supabase
    .from('members')
    .select('first_name, middle_name, last_name, suffix, photo_url')
    .eq('id', user.id)
    .single();

  return (
    <PortalShell title="Kappa Store" activePage="store" member={portalMember}>
      <StoreGrid categories={categories} products={products} />

      {/* Store Notice */}
      <div className="store-notice">
        <p>
          <strong>Ordering Information:</strong> All store purchases require an active membership.
          Items are shipped to the address on file at IHQ. For bulk orders or chapter purchases,
          contact <a href="mailto:store@kappaalphapsi1911.com">store@kappaalphapsi1911.com</a>.
        </p>
      </div>
    </PortalShell>
  );
}
