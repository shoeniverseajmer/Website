import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '../ui/Toast';
import { useWishlistStore } from '../../store/wishlistStore';

export function WishlistButton({ productId, productName }: { productId: string; productName?: string }) {
  const toggle = useWishlistStore((state) => state.toggle);
  const isSaved = useWishlistStore((state) => state.ids.includes(productId));
  const label = isSaved ? 'Remove from wishlist' : 'Add to wishlist';

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      type="button"
      onClick={() => {
        toggle(productId);
        toast.success(isSaved ? 'Removed from wishlist' : `${productName ?? 'Product'} saved`);
      }}
      className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-[0_12px_30px_rgba(17,17,17,0.12)] backdrop-blur transition"
      title={label}
      aria-label={label}
      aria-pressed={isSaved}
    >
      <Heart className={`h-5 w-5 ${isSaved ? 'fill-clay text-clay' : ''}`} />
    </motion.button>
  );
}
