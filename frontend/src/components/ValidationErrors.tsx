export default function ValidationErrors({ errors }: { errors: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-hidden">
      <h4 className="text-red-800 font-semibold text-sm mb-2">Please fix the following errors:</h4>
      <ul className="text-red-700 text-sm space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
} 