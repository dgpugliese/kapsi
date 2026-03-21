'use client';

import { useState } from 'react';

interface Category {
  id: string;
  label: string;
}

interface Product {
  name: string;
  price: number;
  image: string;
  category: string;
  badge: string;
}

interface StoreGridProps {
  categories: Category[];
  products: Product[];
}

export default function StoreGrid({ categories, products }: StoreGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  function handleAddToCart(index: number) {
    setAddedIndex(index);
    setTimeout(() => setAddedIndex(null), 2000);
  }

  return (
    <>
      {/* Category Filter */}
      <div className="store-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`store-filter-btn${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Count */}
      <div className="store-count">
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Product Grid */}
      <div className="store-grid">
        {filtered.map((product, i) => (
          <div className="store-card" key={i}>
            <div className="store-card-img">
              <img src={product.image} alt={product.name} loading="lazy" />
              {product.badge && (
                <span className="store-card-badge">{product.badge}</span>
              )}
            </div>
            <div className="store-card-body">
              <h3 className="store-card-name">{product.name}</h3>
              <div className="store-card-price">${product.price.toFixed(2)}</div>
              <button
                className={`store-card-btn${addedIndex === i ? ' store-card-btn--added' : ''}`}
                onClick={() => handleAddToCart(i)}
              >
                {addedIndex === i ? 'Added \u2713' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
