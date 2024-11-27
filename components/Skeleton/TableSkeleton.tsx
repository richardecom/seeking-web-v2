// TableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
  return (
    <div className="overflow-hidden border border-gray-200 shadow-sm">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3">
              <Skeleton className="w-24 h-4" />
            </th>
            <th className="px-6 py-3">
              <Skeleton className="w-32 h-4" />
            </th>
            <th className="px-6 py-3">
              <Skeleton className="w-24 h-4" />
            </th>
            <th className="px-6 py-3">
              <Skeleton className="w-32 h-4" />
            </th>
            <th className="px-6 py-3">
              <Skeleton className="w-32 h-4" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(7)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="px-6 py-4">
                <Skeleton className="w-24 h-6" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-32 h-6" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-24 h-6" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-32 h-6" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-32 h-6" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
