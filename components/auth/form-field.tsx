export function FormField({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wider text-text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-canvas-line bg-canvas-raised px-3 py-2.5 font-body text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
      />
      {error && <p className="mt-1.5 font-body text-xs text-danger">{error}</p>}
    </div>
  );
}
