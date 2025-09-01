interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-lg">
    {message}
  </div>
);
