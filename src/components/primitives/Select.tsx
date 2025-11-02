import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ value: string; label: string }>;
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  className = '',
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

