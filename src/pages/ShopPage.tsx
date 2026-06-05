import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { FiltersSidebar } from '../components/shop/FiltersSidebar';
import { ProductGrid } from '../components/shop/ProductGrid';
import { SearchBar } from '../components/shop/SearchBar';
import { useProducts } from '../hooks/useProducts';
import type { Product, ProductFilters } from '../types';

type SortValue = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const parseFilters = (params: URLSearchParams): ProductFilters => ({
  search: params.get('search') || undefined,
  gender_category: (params.get('gender_category') as ProductFilters['gender_category']) || undefined,
  product_type: (params.get('product_type') as ProductFilters['product_type']) || undefined,
  accessory_type: (params.get('accessory_type') as ProductFilters['accessory_type']) || undefined,
  occasion: (params.get('occasion') as ProductFilters['occasion']) || undefined,
  sale: params.get('sale') === 'true' || undefined,
  bestseller: params.get('bestseller') === 'true' || undefined
});

const filtersToParams = (filters: ProductFilters, sort: SortValue) => {
  const next = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== false) {
      next.set(key, String(value));
    }
  });
  if (sort !== 'featured') next.set('sort', sort);
  return next;
};

const sortProducts = (products: Product[], sort: SortValue) => {
  const list = [...products];
  if (sort === 'price-asc') return list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
  if (sort === 'price-desc') return list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
  if (sort === 'newest') return list.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  return list.sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
};

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [sort, setSortState] = useState<SortValue>((params.get('sort') as SortValue) || 'featured');
  const [filters, setFiltersState] = useState<ProductFilters>(() => parseFilters(params));
  const { data = [], isLoading } = useProducts(filters);

  useEffect(() => {
    setVisibleCount(9);
  }, [filters, sort]);

  useEffect(() => {
    setFiltersState(parseFilters(params));
    setSortState((params.get('sort') as SortValue) || 'featured');
  }, [params]);

  const updateCatalogue = (nextFilters: ProductFilters, nextSort = sort) => {
    const normalized = {
      ...nextFilters,
      accessory_type: nextFilters.product_type === 'shoes' ? undefined : nextFilters.accessory_type
    };
    setFiltersState(normalized);
    setSortState(nextSort);
    setParams(filtersToParams(normalized, nextSort), { replace: true });
  };

  const updateSort = (nextSort: SortValue) => {
    setSortState(nextSort);
    setParams(filtersToParams(filters, nextSort), { replace: true });
  };

  const activeFilters = Object.entries(filters).filter(([, value]) => value !== undefined && value !== '' && value !== false);

  const sortedProducts = useMemo(() => sortProducts(data, sort), [data, sort]);
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const heading = useMemo(() => {
    if (filters.sale) return 'Sale Collection';
    if (filters.bestseller) return 'Bestsellers';
    if (filters.product_type === 'accessories') return 'Accessories';
    return 'Shop Collection';
  }, [filters.sale, filters.bestseller, filters.product_type]);

  const renderFilters = () => <FiltersSidebar filters={filters} onChange={updateCatalogue} />;

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
      <div className="cosmic-card mb-8 overflow-hidden rounded-[1.75rem]">
        <div className="grid min-h-72 md:grid-cols-[1fr_0.8fr]">
          <div className="p-7 md:p-10">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              <SlidersHorizontal className="h-4 w-4" />
              Cosmic catalogue
            </p>
            <h1 className="cosmic-glow-text text-balance text-4xl font-black leading-tight md:text-6xl">{heading}</h1>
            <p className="mt-4 max-w-xl text-sm font-bold leading-6 text-white/62 md:text-base">
              Find the next pair in your orbit with fast search, launch filters, and glowing quick-add product cards.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=90" alt="Shop collection" className="hidden h-full w-full object-cover opacity-80 md:block" />
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px]">
        <SearchBar value={filters.search ?? ''} onChange={(search) => updateCatalogue({ ...filters, search: search || undefined })} />
        <Select value={sort} onChange={(event) => updateSort(event.target.value as SortValue)} aria-label="Sort products" className="cosmic-input">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </Select>
      </div>

      {activeFilters.length ? (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              onClick={() => updateCatalogue({ ...filters, [key]: undefined })}
              className="focus-ring inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3 text-xs font-black capitalize text-ink shadow-sm ring-1 ring-white/10"
            >
              {String(value).replace(/_/g, ' ')}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
          <button onClick={() => updateCatalogue({})} className="text-xs font-black uppercase tracking-[0.16em] text-white/45 hover:text-white">
            Clear all
          </button>
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm font-bold text-white/60">{sortedProducts.length} products</p>
        <Button className="border-white/15 bg-white/10 text-black hover:bg-white hover:text-ink" icon={<Filter className="h-4 w-4" />} onClick={() => setFiltersOpen(true)}>
          Refine
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">{renderFilters()}</div>
        <div>
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <p className="text-sm font-bold text-white/55">{sortedProducts.length} products curated</p>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200/75">Orbital sneaker edit</p>
          </div>
          <ProductGrid products={visibleProducts} loading={isLoading} />
          {visibleCount < sortedProducts.length ? (
            <div className="mt-8 grid place-items-center">
              <Button className="border-white/15 bg-white/10 text-black hover:bg-white hover:text-ink" onClick={() => setVisibleCount((count) => count + 6)}>
                Load more
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Refine products">
        {renderFilters()}
      </Drawer>
      </div>
    </section>
  );
}
