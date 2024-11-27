// TableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function RowSkeleton() {
  return (
    <>
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
    </>
  );
}
