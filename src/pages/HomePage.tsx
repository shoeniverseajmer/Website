import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Quote, Rocket, ShieldCheck, ShoppingBag, Sparkles, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ProductGrid } from '../components/shop/ProductGrid';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/format';

const collections = [
  {
    title: 'APEX',
    copy: 'Chunky asteroid-core silhouettes',
    href: '/shop?bestseller=true',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=90'
  },
  {
    title: 'X LOWS',
    copy: 'Low-tops with launch-day color',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=90'
  },
  {
    title: 'AEON',
    copy: 'Lightweight speed from tomorrow',
    href: '/shop?gender_category=women',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=90'
  }
];

const launchNotes = [
  ['01', 'Ignition foam', 'Soft landings with enough bounce to keep the day moving.'],
  ['02', 'Meteor panels', 'Layered uppers, bright hits, and clean contrast from every angle.'],
  ['03', 'Orbit grip', 'Grounded traction for city paths, late plans, and quick turns.']
];

const testimonials = [
  {
    quote: 'They look like a sneaker drop from a space station, but they still work with jeans.',
    name: 'Aarav'
  },
  {
    quote: 'The color shift is wild in sunlight. Everyone asked what pair I was wearing.',
    name: 'Maya'
  },
  {
    quote: 'Chunky without feeling heavy. Exactly the kind of daily rotation pair I wanted.',
    name: 'Rishi'
  }
];

const sizes = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: bestsellers = [], isLoading: loadingBest } = useProducts({ bestseller: true });
  const { data: saleProducts = [], isLoading: loadingSale } = useProducts({ sale: true });
  const heroProduct = products[0];
  const heroImage = heroProduct?.product_images?.[0]?.image_url ?? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=90';

  return (
    <div className="overflow-hidden bg-[#050507] text-white">
      <section className="cosmic-shell -mt-[72px] min-h-[calc(100vh+72px)] pt-[72px]">
        <div className="container-shell relative z-10 grid min-h-[calc(100vh+72px)] gap-10 pb-14 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <p className="cosmic-pill">
              <Rocket className="h-4 w-4" />
              Galactic sneaker drop
            </p>
            <h1 className="cosmic-glow-text mt-6 max-w-4xl text-balance text-6xl font-black uppercase leading-[0.88] md:text-8xl">
              Sneakers from another frequency
            </h1>
            <p className="mt-6 max-w-xl text-base font-bold leading-8 text-white/66 md:text-lg">
              Comet-style drops reimagined as a cosmic storefront: neon trails, deep-space panels, and chunky silhouettes that feel impossible to ignore.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button className="bg-white text-ink shadow-[0_0_36px_rgba(120,247,255,0.34)] hover:bg-cyan-100" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                <Link to="/shop">Enter the drop</Link>
              </Button>
              <Button className="border border-white/15 bg-white/10 text-white hover:bg-white hover:text-ink" size="lg">
                <Link to="/shop?bestseller=true">Apex bestsellers</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['12', 'sizes'],
                ['4.9', 'rated'],
                ['24h', 'dispatch']
              ].map(([value, label]) => (
                <div key={label} className="cosmic-card rounded-[1.25rem] p-4">
                  <p className="text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-white/42">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative min-h-[540px]">
            <div className="absolute left-1/2 top-1/2 h-[min(68vw,560px)] w-[min(68vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[min(54vw,430px)] w-[min(54vw,430px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20" />
            <div className="absolute left-2 top-10 hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur md:block">
              mission 09
            </div>
            <img
              src={heroImage}
              alt={heroProduct?.name ?? 'Cosmic sneaker drop'}
              className="absolute left-1/2 top-1/2 h-[min(74vw,620px)] w-[min(74vw,620px)] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[2rem] object-cover shadow-[0_44px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/15"
            />
            <div className="cosmic-card absolute bottom-0 right-0 w-full max-w-sm rounded-[1.5rem] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Now boarding</p>
                  <h2 className="mt-1 text-2xl font-black">{heroProduct?.name ?? 'Apex Evergreen'}</h2>
                  <p className="mt-1 text-sm font-bold text-white/52">{formatCurrency(heroProduct?.sale_price ?? heroProduct?.price ?? 6299)}</p>
                </div>
                <Link to="/shop" className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-[0_0_28px_rgba(170,255,72,0.26)]">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="container-shell flex min-h-16 items-center gap-8 overflow-x-auto whitespace-nowrap py-4 text-xs font-black uppercase tracking-[0.22em] text-white/54 scrollbar-none">
          {['Apex', 'X Lows', 'Aeon', 'Alter', 'Orbit sizing', 'The Vault', 'Meteor sale', 'Launch tracker'].map((item) => (
            <Link key={item} to="/shop" className="transition hover:text-white">
              {item}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <SectionHeading
          tone="dark"
          eyebrow="Signal locked"
          title="Fresh pairs with interstellar pull"
          copy="Quick-add sizes, luminous colorways, and chunky silhouettes that carry the whole fit."
          action={<Link to="/shop" className="text-sm font-black text-cyan-200 underline">View all</Link>}
        />
        <ProductGrid products={products.slice(0, 3)} loading={isLoading} />
      </section>

      <section className="container-shell py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div key={collection.title} whileHover={{ y: -8 }} className="group relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
              <img src={collection.image} alt={collection.title} className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Collection 0{index + 1}</p>
                <h2 className="mt-2 text-5xl font-black">{collection.title}</h2>
                <p className="mt-2 text-sm font-bold text-white/62">{collection.copy}</p>
                <Link to={collection.href} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-ink">
                  Shop collection <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="cosmic-pill">
              <Zap className="h-4 w-4" />
              Built for launch
            </p>
            <h2 className="cosmic-glow-text mt-5 text-balance text-5xl font-black leading-none md:text-7xl">
              The shoe should feel like the event.
            </h2>
            <p className="mt-5 max-w-lg text-base font-bold leading-8 text-white/58">
              Every panel, glow, hover state, and quick-add action is tuned to make the sneaker feel bigger than a product tile.
            </p>
          </div>
          <div className="grid gap-4">
            {launchNotes.map(([number, title, copy]) => (
              <div key={title} className="cosmic-card grid gap-4 rounded-[1.5rem] p-5 sm:grid-cols-[90px_1fr]">
                <span className="cosmic-outline-text text-6xl font-black leading-none">{number}</span>
                <div>
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/56">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <SectionHeading tone="dark" eyebrow="Bestsellers" title="The pairs with gravity" />
        <ProductGrid products={bestsellers.slice(0, 3)} loading={loadingBest} />
      </section>

      <section className="py-16">
        <div className="container-shell">
          <div className="cosmic-card overflow-hidden rounded-[1.75rem]">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="cosmic-pill">
                  <Sparkles className="h-4 w-4" />
                  Meteor sale
                </p>
                <h2 className="mt-5 text-balance text-5xl font-black leading-none md:text-7xl">Too much heat in the cargo bay.</h2>
                <p className="mt-5 max-w-md text-sm font-bold leading-7 text-white/58">
                  Limited pairs from earlier drops, pulled into a sale window before they disappear from the map.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <span key={size} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-sm font-black">
                      {size}
                    </span>
                  ))}
                </div>
                <Button className="mt-8 bg-white text-ink hover:bg-lime-100" icon={<ShoppingBag className="h-4 w-4" />}>
                  <Link to="/shop?sale=true">Shop sale</Link>
                </Button>
              </div>
              <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1300&q=90" alt="Cosmic sneaker sale edit" className="h-full min-h-96 w-full object-cover opacity-88" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <SectionHeading tone="dark" eyebrow="Last signal" title="Limited-time selections" />
        <ProductGrid products={saleProducts.slice(0, 3)} loading={loadingSale} />
      </section>

      <section className="container-shell py-16">
        <SectionHeading tone="dark" eyebrow="Transmission logs" title="What the crew is saying" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="cosmic-card rounded-[1.25rem] p-6">
              <Quote className="h-8 w-8 text-cyan-200/70" />
              <h3 className="mt-5 text-xl font-black leading-8">“{item.quote}”</h3>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-white/42">{item.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="grid gap-4 border-y border-white/10 py-8 text-center md:grid-cols-4">
          {['GQ', 'HYPEBEAST', 'LBB', 'ELLE'].map((brand) => (
            <span key={brand} className="text-2xl font-black tracking-[0.18em] text-white/28">
              {brand}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
