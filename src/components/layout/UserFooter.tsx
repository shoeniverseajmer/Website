import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';

const footerGroups = [
  {
    title: 'GET IN TOUCH',
    links: [
      { label: 'Whatsapp : +91 9606081463', to: 'https://wa.me/919606081463' },
      { label: 'Support: surajnandan78@gmail.com', to: 'mailto:surajnandan78@gmail.com' },
      { label: 'Location', to: 'https://share.google/sBASapABqQlWChE2U' },
      { label: 'Instagram', to: 'https://www.instagram.com/theuniverseof.shoes?igsh=MWJjMDM5ZWkzbGRkNg%3D%3D&utm_source=qr' }
    ]
  },
  {
    title: 'ABOUT US',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'Craftsmanship', to: '/shop' },
      { label: 'The Vault', to: '/shop?bestseller=true' },
      { label: 'The Garage', to: '/shop?sale=true' }
    ]
  },
  {
    title: 'QUICK LINKS',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Store Locator', to: 'https://share.google/sBASapABqQlWChE2U' },
      { label: 'Return and Exchange', to: '/orders' },
      { label: 'FAQ', to: '/shop' }
    ]
  }
];

export function UserFooter() {
  return (
    <footer className="cosmic-shell mt-0 pb-20 text-white lg:pb-0">
      <div className="container-shell relative z-10 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.1fr]">
          <div>
            <Link to="/" className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 p-2 shadow-soft ring-1 ring-white/10">
                <img src="/logo.png" alt="Shoniverse" className="h-12 w-12 rounded-full object-contain" />
              </span>
              <span className="cosmic-glow-text text-4xl font-black tracking-[0.08em]">Shoniverse</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm font-bold leading-7 text-white/60">
              Homegrown sneaker energy, bold colorways, quick drops, and pairs built for the daily rotation.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold text-white/62">
              <a href="https://share.google/sBASapABqQlWChE2U" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                <MapPin className="h-4 w-4 text-cyan-200" /> Location
              </a>
              <a href="mailto:surajnandan78@gmail.com" className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4 text-cyan-200" /> surajnandan78@gmail.com
              </a>
              <a
                href="https://www.instagram.com/theuniverseof.shoes?igsh=MWJjMDM5ZWkzbGRkNg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Instagram className="h-4 w-4 text-cyan-200" /> Instagram
              </a>
              <a href="https://wa.me/919606081463" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                <MessageCircle className="h-4 w-4 text-cyan-200" /> Track your order on WhatsApp
              </a>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white/45">{group.title}</h3>
                <div className="mt-4 grid gap-3 text-sm font-bold text-white/65">
                  {group.links.map((link) =>
                    link.to.startsWith('http') ? (
                      <a
                        key={`${group.title}-${link.label}`}
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className="transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link key={`${group.title}-${link.label}`} to={link.to} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs font-bold text-white/45">
          <span>© {new Date().getFullYear()} Grails Marketing Private Limited. All Rights Reserved.</span>
          <a
            href="https://www.instagram.com/theuniverseof.shoes?igsh=MWJjMDM5ZWkzbGRkNg%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
