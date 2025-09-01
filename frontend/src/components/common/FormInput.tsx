interface FormInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export const FormInput = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  hasError,
  errorMessage,
}: FormInputProps) => (
  <div className="space-y-1">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 placeholder-blue-500 text-black rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        hasError
          ? "border-red-500 bg-red-50 focus:border-red-500"
          : "border-gray-300 focus:border-blue-500"
      }`}
    />
    {hasError && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);
