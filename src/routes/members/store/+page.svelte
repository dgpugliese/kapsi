<script>
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'pins', label: 'Pins & Badges' },
    { id: 'life', label: 'Life Membership' },
    { id: 'apparel', label: 'Apparel & Accessories' },
    { id: 'books', label: 'Books & Publications' }
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
    { name: 'Protocol & Etiquette Manual', price: 25, image: '/images/store/protocol-manual.jpg', category: 'books', badge: '' }
  ];

  let activeCategory = 'all';
  let addedIndex = null;

  $: filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  function handleAddToCart(index) {
    addedIndex = index;
    setTimeout(() => { addedIndex = null; }, 2000);
  }
</script>

<svelte:head>
  <title>Kappa Store — Kappa Alpha Psi®</title>
</svelte:head>

<div class="portal-page-header">
  <h1>Kappa Store</h1>
</div>

<div class="portal-content">
  <!-- Category Filter -->
  <div class="store-filters">
    {#each categories as cat}
      <button
        class="store-filter-btn"
        class:active={activeCategory === cat.id}
        on:click={() => (activeCategory = cat.id)}
      >
        {cat.label}
      </button>
    {/each}
  </div>

  <!-- Product Count -->
  <div class="store-count">
    {filtered.length} product{filtered.length !== 1 ? 's' : ''}
  </div>

  <!-- Product Grid -->
  <div class="store-grid">
    {#each filtered as product, i}
      <div class="store-card">
        <div class="store-card-img">
          <img src={product.image} alt={product.name} loading="lazy" />
          {#if product.badge}
            <span class="store-card-badge">{product.badge}</span>
          {/if}
        </div>
        <div class="store-card-body">
          <h3 class="store-card-name">{product.name}</h3>
          <div class="store-card-price">${product.price.toFixed(2)}</div>
          <button
            class="store-card-btn"
            class:store-card-btn--added={addedIndex === i}
            on:click={() => handleAddToCart(i)}
          >
            {addedIndex === i ? 'Added \u2713' : 'Add to Cart'}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Store Notice -->
  <div class="store-notice">
    <p>
      <strong>Ordering Information:</strong> All store purchases require an active membership.
      Items are shipped to the address on file at IHQ. For bulk orders or chapter purchases,
      contact <a href="mailto:store@kappaalphapsi1911.com">store@kappaalphapsi1911.com</a>.
    </p>
  </div>
</div>

<style>
  .portal-page-header {
    padding: 24px 32px;
    background: #fff;
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: var(--shadow-sm);
  }

  .portal-page-header h1 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0;
  }

  .portal-content {
    background: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
    padding: 32px;
    box-shadow: var(--shadow-sm);
  }

  /* Store Filters */
  .store-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .store-filter-btn {
    padding: 8px 16px;
    border: 1px solid var(--gray-200);
    border-radius: 20px;
    background: #fff;
    color: var(--gray-600);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: all 0.15s;
  }

  .store-filter-btn:hover {
    border-color: var(--gray-300);
    background: var(--gray-50);
  }

  .store-filter-btn.active {
    background: var(--crimson);
    color: #fff;
    border-color: var(--crimson);
  }

  .store-count {
    font-size: 0.85rem;
    color: var(--gray-500);
    margin-bottom: 20px;
  }

  /* Product Grid */
  .store-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .store-card {
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    overflow: hidden;
    transition: box-shadow 0.15s, transform 0.15s;
    background: #fff;
  }

  .store-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .store-card-img {
    position: relative;
    aspect-ratio: 1;
    background: var(--gray-100);
    overflow: hidden;
  }

  .store-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .store-card-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--crimson);
    color: #fff;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .store-card-body {
    padding: 14px;
  }

  .store-card-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 6px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .store-card-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--crimson);
    margin-bottom: 10px;
    font-variant-numeric: tabular-nums;
  }

  .store-card-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--crimson);
    border-radius: 8px;
    background: #fff;
    color: var(--crimson);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: all 0.15s;
  }

  .store-card-btn:hover {
    background: var(--crimson);
    color: #fff;
  }

  .store-card-btn--added {
    background: #059669;
    border-color: #059669;
    color: #fff;
  }

  /* Store Notice */
  .store-notice {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 16px 20px;
  }

  .store-notice p {
    font-size: 0.85rem;
    color: var(--gray-600);
    margin: 0;
    line-height: 1.5;
  }

  .store-notice a {
    color: var(--crimson);
    text-decoration: none;
    font-weight: 500;
  }

  .store-notice a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .portal-page-header { padding: 16px 20px; }
    .portal-content { padding: 20px; }
    .store-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  }
</style>
