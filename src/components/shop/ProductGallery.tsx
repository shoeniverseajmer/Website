import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { Product } from '../../types';

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(
    () => (product.product_images?.length ? product.product_images : [{ id: 'fallback', product_id: product.id, image_url: '' }]),
    [product.id, product.product_images]
  );
  const [active, setActive] = useState(images[0]);
  const [zoomOpen, setZoomOpen] = useState(false);
  const activeIndex = Math.max(0, images.findIndex((image) => image.image_url === active.image_url));

  useEffect(() => {
    setActive(images[0]);
    setZoomOpen(false);
  }, [images]);

  const move = (direction: 1 | -1) => {
    const nextIndex = (activeIndex + direction + images.length) % images.length;
    setActive(images[nextIndex]);
  };

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:grid lg:content-start">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActive(image)}
              aria-label={`View image ${index + 1}`}
              className={`aspect-square h-20 shrink-0 overflow-hidden rounded-2xl border transition ${
                active.image_url === image.image_url ? 'border-cyan-200 shadow-soft' : 'border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              <img src={image.image_url} alt={product.name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <motion.div layout className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#111116] shadow-luxe ring-1 ring-white/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={active.image_url}
                src={active.image_url}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </AnimatePresence>
            <button
              onClick={() => setZoomOpen(true)}
              className="focus-ring absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur"
              aria-label="Open image zoom"
            >
              <Expand className="h-4 w-4" />
            </button>
            {images.length > 1 ? (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={() => move(-1)} className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur" aria-label="Previous image">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => move(1)} className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur" aria-label="Next image">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title={product.name} size="lg">
        <div className="overflow-hidden rounded-2xl bg-mist">
          <img src={active.image_url} alt={product.name} className="max-h-[72vh] w-full object-contain" />
        </div>
      </Modal>
    </>
  );
}
