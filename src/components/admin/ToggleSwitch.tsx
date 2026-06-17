export function ToggleSwitch({
  checked,
  onChange,
  label,
  description
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="focus-ring flex w-full items-center justify-between gap-4 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-ink/5 transition hover:shadow-soft"
      aria-pressed={checked}
    >
      <span>
        <span className="block font-black">{label}</span>
        {description ? <span className="mt-1 block text-sm leading-6 text-ink/55">{description}</span> : null}
      </span>
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${checked ? 'bg-ink' : 'bg-ink/20'}`}
      >
        <span
          className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </span>
    </button>
  );
}
