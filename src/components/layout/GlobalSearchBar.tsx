import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function GlobalSearchBar({
  compact = false,
  autoFocus = false,
  onSearch
}: {
  compact?: boolean;
  autoFocus?: boolean;
  onSearch?: () => void;
}) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : '/shop');
    onSearch?.();
  };

  return (
    <motion.form
      layout
      onSubmit={submit}
      className={cn(
        'group relative w-full',
        compact ? 'max-w-[280px]' : 'max-w-xl'
      )}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition group-focus-within:text-cyan-200" />
      <input
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Apex, X Lows, Aeon"
        className={cn(
          'focus-ring h-11 w-full rounded-full border border-white/10 bg-white/10 pl-11 pr-10 text-sm font-semibold text-white shadow-sm backdrop-blur-xl placeholder:text-white/35 transition focus:border-white/25',
          !compact && 'h-12'
        )}
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/45 hover:bg-white/10 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </motion.form>
  );
}
