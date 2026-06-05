import { ProductGrid } from '../components/shop/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useWishlistStore } from '../store/wishlistStore';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const ids = useWishlistStore((state) => state.ids);
  const { data = [], isLoading } = useProducts();
  const products = data.filter((product) => ids.includes(product.id));

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Saved orbit</p>
        <h1 className="cosmic-glow-text mt-2 text-4xl font-black md:text-6xl">Wishlist</h1>
        <p className="mt-3 font-bold text-white/60">Your considered pairs, ready when you are.</p>
      </div>
      {ids.length ? (
        <ProductGrid products={products} loading={isLoading} />
      ) : (
        <EmptyState title="No saved products yet" copy="Save products from the catalogue to build your personal edit." action={<Button><Link to="/shop">Explore collection</Link></Button>} />
      )}
      </div>
    </section>
  );
}
