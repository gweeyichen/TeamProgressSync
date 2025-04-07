import { ValidationError } from '@/lib/types';

interface ValidationSummaryProps {
  errors: ValidationError[];
  visible: boolean;
}

export default function ValidationSummary({ errors, visible }: ValidationSummaryProps) {
  if (!visible || errors.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="bg-error/10 border-l-4 border-error p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className="ri-error-warning-line text-error text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-error">Validation Errors</h3>
            <div className="mt-1 text-sm text-neutral-700">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
