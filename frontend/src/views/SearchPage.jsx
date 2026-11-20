import React, { useMemo } from 'react';
import { Search, PackageCheck, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { CATEGORIES } from '../data/auctionEvents';

export const SearchPage = () => {
  const { products, isLoadingProducts } = useAuction();
  const { queryParams, navigate } = useRouter();

  const searchQuery = (queryParams.get('q') || '').trim();

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const titleMatch = (p.title || '').toLowerCase().includes(query);
      const brandMatch = (p.brand || '').toLowerCase().includes(query);
      const skuMatch = (p.sku || '').toLowerCase().includes(query);
      const catMatch = (p.category || '').toLowerCase().includes(query);
      const descMatch = (p.description || '').toLowerCase().includes(query);
      return titleMatch || brandMatch || skuMatch || catMatch || descMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="search-page-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Search</span>
        </div>

        {/* Search Header */}
        <div className="search-header-banner">
          <h1 className="search-main-title">
            Search Results for: <span className="search-query-highlight">"{searchQuery}"</span>
          </h1>
          <p className="search-results-count">
            Found {searchResults.length} asset{searchResults.length === 1 ? '' : 's'} matching your search.
          </p>
        </div>

        {/* Results Grid or Honest Empty State */}
        {isLoadingProducts ? (
          <div className="loading-grid-skeleton">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="search-zero-results-box">
            <PackageCheck size={56} color="var(--ink-muted)" style={{ margin: '0 auto 1.25rem' }} />
            <h2>No assets matched "{searchQuery}"</h2>
            <p>
              We couldn't find any current inventory matching that query. We never show irrelevant filler or fake stock.
            </p>

            <div className="search-zero-suggestions">
              <h3>Popular Departments to Browse:</h3>
              <div className="search-category-pill-grid">
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="search-cat-pill"
                    onClick={() => navigate(`/collections/${cat.id}`)}
                  >
                    <span>{cat.name}</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/collections/all')}
              style={{ marginTop: '2rem' }}
            >
              Browse Full Catalogue
            </button>
          </div>
        ) : (
          <div className="products-grid-catalog">
            {searchResults.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
