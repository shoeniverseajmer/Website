import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import type { Product } from '../../types';

export function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <EmptyState title="No products found" copy="Try a different search, category, or occasion filter." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
