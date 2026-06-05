import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative group">
      <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 transition group-focus-within:text-cyan-200" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search Apex, X Lows, Aeon"
        className="focus-ring h-14 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-5 text-sm text-white shadow-sm backdrop-blur placeholder:text-white/35 transition focus:border-white/30"
      />
    </div>
  );
}
