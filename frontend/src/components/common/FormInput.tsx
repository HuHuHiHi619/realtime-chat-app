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
      className={`w-full px-4 py-3 placeholder-brandChoco-50 border-2 text-brandChoco-50 
        rounded-lg  transition-colors focus:outline-none 
        hover:bg-brandChoco-100 hover:placeholder-white hover:text-white
        ${
        hasError
          ? "border-red-500 bg-red-50 focus:border-red-500"
          : "border-brandChoco-50 focus:border-brandChoco-50"
      }`}
    />
    {hasError && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);
