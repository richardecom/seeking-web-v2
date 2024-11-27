import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { ContentTitle } from '@/components/Shared/ContentTitle';
import { Box, LayoutList, MapPin } from 'lucide-react';
import React from 'react';
import TableLayout from '@/components/Shared/TableLayout';
import { CategoryDataTable } from '@/components/Categories/CategoryDataTable';


const CategoryPage = () => {
  return (
    <DefaultLayout>
        <ContentTitle title="Category List" icon={<LayoutList />} />
        <TableLayout>
            <CategoryDataTable/>
        </TableLayout>
    </DefaultLayout>
  );
};

export default CategoryPage;
