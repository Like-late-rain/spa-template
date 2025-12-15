interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function NumberInput({
  value,
  onChange,
  placeholder = '请输入数字',
  label,
  min = '0',
  max,
  step = '0.01',
  className = '',
  disabled = false,
  size = 'md',
}: NumberInputProps) {
  // 根据 size 设置不同的样式
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor="numberInput" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        autoComplete="off"
        className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
        style={{
          color: '#000000',
          backgroundColor: '#ffffff',
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
        }}
      />
    </div>
  );
}
