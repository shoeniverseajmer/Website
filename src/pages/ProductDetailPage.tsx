import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HeartHandshake, MapPin, Ruler, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';
import { ProductGallery } from '../components/shop/ProductGallery';
import { ProductGrid } from '../components/shop/ProductGrid';
import { QuantitySelector } from '../components/shop/QuantitySelector';
import { WishlistButton } from '../components/shop/WishlistButton';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { useCartStore } from '../store/cartStore';
import { formatCurrency, toTitleCase } from '../utils/format';

const tabs = ['Details', 'Delivery', 'Reviews'] as const;
type ProductTab = (typeof tabs)[number];

const swatchBackground = (color: string) => {
  const normalized = color.toLowerCase();
  if (normalized.includes('green silver')) return 'linear-gradient(135deg, #83f6a6, #d8dde2 54%, #2f4c40)';
  if (normalized.includes('brown black')) return 'linear-gradient(135deg, #8a542f, #111111)';
  if (normalized.includes('grey black')) return 'linear-gradient(135deg, #a7adb5, #101014)';
  if (normalized.includes('blue')) return 'linear-gradient(135deg, #78f7ff, #3852ff, #111116)';
  if (normalized.includes('pink green')) return 'linear-gradient(135deg, #ff7aaa, #aaff48)';
  if (normalized.includes('black grey')) return 'linear-gradient(135deg, #111111, #8b9199)';
  if (normalized === 'ivory') return '#f8f5ef';
  if (normalized === 'tan') return '#b9895b';
  return normalized;
};

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState<ProductTab>('Details');
  const { data: product, isLoading } = useProduct(slug);
  const { data: relatedPool = [] } = useProducts(product ? { gender_category: product.gender_category } : undefined);
  const { data: allProducts = [] } = useProducts();
  const { data: settings } = useStoreSettings();
  const add = useCartStore((state) => state.add);

  const variants = product?.product_variants ?? [];
  const sizes = useMemo(() => Array.from(new Set(variants.map((variant) => variant.size))), [variants]);
  const colors = useMemo(() => Array.from(new Set(variants.map((variant) => variant.color))), [variants]);
  const availableColors = useMemo(
    () => (selectedSize ? Array.from(new Set(variants.filter((variant) => variant.size === selectedSize).map((variant) => variant.color))) : colors),
    [colors, selectedSize, variants]
  );
  const selectedVariant = useMemo(
    () =>
      variants.find(
        (variant) =>
          (!selectedSize || variant.size === selectedSize) &&
          (!selectedColor || variant.color === selectedColor)
      ),
    [selectedColor, selectedSize, variants]
  );

  useEffect(() => {
    if (!product) return;
    setSelectedSize((current) => (current && sizes.includes(current) ? current : sizes[0] ?? ''));
    setQuantity(1);
  }, [product, sizes]);

  useEffect(() => {
    setSelectedColor((current) => (current && availableColors.includes(current) ? current : availableColors[0] ?? ''));
  }, [availableColors]);

  if (isLoading) {
    return (
      <section className="cosmic-shell text-white">
        <div className="container-shell relative z-10 grid gap-10 py-8 md:py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <Skeleton className="aspect-[4/5] rounded-[2rem]" />
        <div>
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="mt-5 h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-3/4" />
          <Skeleton className="mt-8 h-72 rounded-[2rem]" />
        </div>
        </div>
      </section>
    );
  }
  if (!product) {
    return (
      <section className="cosmic-shell text-white">
        <div className="container-shell relative z-10 py-16">
        <EmptyState title="Product not found" copy="The item may have moved out of the collection." action={<Link to="/shop" className="font-black underline">Return to shop</Link>} />
        </div>
      </section>
    );
  }

  const price = product.sale_price ?? product.price;
  const variantStock = selectedVariant?.stock ?? product.stock;
  const outOfStock = variantStock <= 0;
  const sameCategory = relatedPool.filter((item) => item.id !== product.id);
  const fallbackRelated = allProducts.filter((item) => item.id !== product.id && !sameCategory.some((related) => related.id === item.id));
  const related = [...sameCategory, ...fallbackRelated].slice(0, 3);

  const addSelectedProduct = () => {
    if (sizes.length && !selectedSize) {
      toast.error('Select a size first');
      return;
    }
    if (availableColors.length && !selectedColor) {
      toast.error('Select a color first');
      return;
    }
    if (outOfStock) {
      toast.error('Selected variant is out of stock');
      return;
    }
    add(product, quantity);
    toast.success(`${product.name} added${selectedSize ? ` · Size ${selectedSize}` : ''}${selectedColor ? ` · ${selectedColor}` : ''}`);
  };

  return (
    <>
      <section className="cosmic-shell text-white">
        <div className="container-shell relative z-10 grid gap-10 py-8 md:py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <ProductGallery product={product} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-4 flex flex-wrap gap-2">
              {product.is_on_sale ? <Badge tone="sale">Sale</Badge> : null}
              {product.is_bestseller ? <Badge tone="success">Bestseller</Badge> : null}
              <Badge>{toTitleCase(product.occasion)}</Badge>
            </div>
            <h1 className="cosmic-glow-text text-balance text-4xl font-black leading-tight md:text-6xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-cyan-200 text-cyan-200" />
              ))}
              <span className="text-sm font-bold text-white/55">4.9 · 128 reviews</span>
            </div>
            <p className="mt-5 text-base font-bold leading-8 text-white/65">{product.description}</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-black">{formatCurrency(price)}</span>
              {product.sale_price ? <span className="text-lg text-white/35 line-through">{formatCurrency(product.price)}</span> : null}
            </div>
          </motion.div>

          <div className="cosmic-card mt-8 space-y-6 rounded-[1.5rem] p-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-black">Select size</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white/50">
                  <Ruler className="h-3.5 w-3.5" />
                  Size guide
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {(sizes.length ? sizes : ['6', '7', '8', '9', '10', '11']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`focus-ring h-12 rounded-full border text-sm font-black transition ${
                      selectedSize === size ? 'border-white bg-white text-ink' : 'border-white/10 bg-white/10 text-white hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-black">Color</h2>
                {selectedVariant ? <span className="text-xs font-bold text-white/50">{selectedVariant.stock} available</span> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {(availableColors.length ? availableColors : ['Black', 'Ivory', 'Tan']).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-pressed={selectedColor === color}
                    className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition ${
                      selectedColor === color ? 'border-white bg-white text-ink' : 'border-white/10 bg-white/10 text-white hover:border-white/30'
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border ${selectedColor === color ? 'border-ink/30' : 'border-white/20'}`}
                      style={{ background: swatchBackground(color) }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                className="min-h-12 flex-1 bg-white text-black hover:bg-cyan-100"
                icon={<ShoppingBag className="h-4 w-4" />}
                onClick={addSelectedProduct}
                disabled={outOfStock}
              >
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </Button>
              <WishlistButton productId={product.id} productName={product.name} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              [Truck, settings?.delivery_enabled ? 'Delivery available' : 'Delivery paused'],
              [MapPin, settings?.pickup_enabled ? 'Pickup available' : 'Pickup paused'],
              [ShieldCheck, `${variantStock} in stock`]
            ].map(([Icon, label]) => (
              <div key={String(label)} className="cosmic-card rounded-2xl p-4 text-sm font-black">
                <Icon className="mb-2 h-5 w-5 text-cyan-200" />
                {label as string}
              </div>
            ))}
          </div>

          <div className="cosmic-card mt-6 rounded-[1.5rem] p-5">
            <div className="mb-4 flex gap-2 overflow-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${activeTab === tab ? 'bg-white text-ink' : 'bg-white/10 text-white/60 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === 'Details' ? <p className="text-sm leading-7 text-white/62">Premium construction, refined proportions, soft interior finishing, and all-day stability for elevated daily wear.</p> : null}
            {activeTab === 'Delivery' ? <p className="text-sm leading-7 text-white/62">Delivery estimates are calculated at checkout. Pickup is available from {settings?.pickup_address ?? 'the flagship studio'} when enabled.</p> : null}
            {activeTab === 'Reviews' ? (
              <div className="space-y-3 text-sm leading-7 text-white/62">
                <p className="font-bold text-white">“Clean profile, premium feel, and easy to style.”</p>
                <p>Verified buyers rate this product highly for comfort, finishing, and versatility.</p>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </section>

      <section className="bg-[#050507] py-10 text-white">
        <div className="container-shell">
        <SectionHeading tone="dark" eyebrow="Complete the orbit" title="Related products" />
        <ProductGrid products={related} />
        </div>
      </section>

      <section className="bg-[#050507] py-4 text-white">
        <div className="container-shell">
        <div className="cosmic-card rounded-[1.5rem] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <HeartHandshake className="h-8 w-8 text-cyan-200" />
              <div>
                <h2 className="text-xl font-black">Premium aftercare</h2>
                <p className="mt-1 text-sm text-white/65">Care guidance and exchange support for every order.</p>
              </div>
            </div>
            <Link to="/checkout" className="rounded-full bg-white px-5 py-3 text-sm font-black text-ink">
              Checkout
            </Link>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
