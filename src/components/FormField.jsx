export default function FormField({
  label,
  id,
  error,
  type = 'text',
  options,
  register,
  placeholder,
  rows,
  ...rest
}) {
  const base = [
    'w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-all duration-150',
    'bg-gray-900 text-gray-100 placeholder:text-gray-600',
    error
      ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
      : 'border-gray-700 hover:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20',
  ].join(' ');

  const renderInput = () => {
    if (options) {
      return (
        <select id={id} className={`${base} cursor-pointer`} {...register} {...rest}>
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    if (rows) {
      return (
        <textarea
          id={id}
          rows={rows}
          className={`${base} resize-none`}
          placeholder={placeholder}
          {...register}
          {...rest}
        />
      );
    }
    return (
      <input
        id={id}
        type={type}
        className={base}
        placeholder={placeholder}
        {...register}
        {...rest}
      />
    );
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-gray-400 tracking-wide">
        {label}
      </label>
      {renderInput()}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1" role="alert">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
