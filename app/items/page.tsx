import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { ContentTitle } from '@/components/Shared/ContentTitle';
import { Box, MapPin } from 'lucide-react';
import React from 'react';
import TableLayout from '@/components/Shared/TableLayout';
import { ItemDataTable } from '@/components/Items/ItemDataTable';


const ItemPage = () => {
  return (
    <DefaultLayout>
        <ContentTitle title="Item List" icon={<Box />} />
        <TableLayout>
            <ItemDataTable/>
        </TableLayout>
    </DefaultLayout>
  );
};

export default ItemPage;
